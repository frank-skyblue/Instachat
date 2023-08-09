import Peer from "peerjs";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { PeerStream } from "../../App";
import socket from "./socket";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PEER_URL_PROD!
    : process.env.REACT_APP_PEER_URL!;
const serverUrlObj = new URL(serverUrl);

// Create peer id from socket id
export const createPeerId = (socket: Socket) => {
  return "a" + socket.id + "b";
};

export const peerConstructor = (id: string) => {
  return new Peer(id, {
    host: serverUrlObj.hostname,
    port: parseInt(serverUrlObj.port),
    secure: serverUrlObj.protocol === "https:",
  });
};

export const usePeer = (
  ownStream: MediaStream | null,
  setStreams: React.Dispatch<React.SetStateAction<PeerStream[]>>
) => {
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [socketConn, setSocketConn]= useState(false);

  useEffect(() => {
    const createNewPeer = () => {
      if (myPeer) {
        myPeer.destroy();
      }
      const newPeer = peerConstructor(createPeerId(socket));
      newPeer.on("call", async (call) => {
        try {
          if (ownStream) {
            call.answer(ownStream);
          }
          receivePeerStream(call);
        } catch (e) {}
      });

      setMyPeer(newPeer);
    };

    if (socketConn && !myPeer && !!ownStream) {
      createNewPeer();
    }

    const receivePeerStream = (call: Peer.MediaConnection) => {
      call.on("stream", (callerStream) => {
        setStreams((streams) => {
          const newPeerStreams = streams.concat();
          // Need to check this since the stream event gets triggered for video and audio
          // Even though one stream object contains both
          if (!newPeerStreams.find((peer) => peer.peerId === call.peer)) {
            const newPeerStream: PeerStream = {
              peerId: call.peer,
              stream: callerStream,
              call,
            };

            newPeerStreams.push(newPeerStream);
            return newPeerStreams;
          }
          return newPeerStreams;
        });
      });
    };

    socket.removeAllListeners("connect");
    socket.on("connect", () => {
      setSocketConn(true);
    });

    socket.removeAllListeners("new_caller");
    socket.on("new_caller", ({ callerId }) => {
      if (!myPeer || !ownStream) return;
      const call = myPeer.call(callerId, ownStream);
      receivePeerStream(call);
    });

    socket.removeAllListeners("room_left");
    socket.on("room_left", ({ callerId }) => {
      setStreams((streams) => {
        const streamsCopy = streams.concat();
        streamsCopy.forEach((stream) => {
          if (stream.peerId === callerId && stream.call) {
            stream.call.close();
          }
        });

        return streamsCopy.filter((stream) => stream.peerId !== callerId);
      });
    });

    return () => {
      socket.removeAllListeners("connect");
      socket.removeAllListeners("new_caller");
      socket.removeAllListeners("room_left");
    }
  }, [myPeer, ownStream, setStreams, socketConn]);
};
