
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "./components/Nav"
import { Button, Container, Navbar } from "react-bootstrap";
import { Whiteboard } from "./Whiteboard/Whiteboard"
import { VideoBox } from "./components/VideoBox";
import { appContext } from "../App";
import "./HomePage.css"
import socket from "./helpers/socket";

interface Props { }

export const HomePage: React.FC<Props> = () => {
  const { currentRoom, streams, setStreams, ownStream } = useContext(appContext)!;
  const navigate = useNavigate();

  const leavePage = useCallback(() => {
    navigate('/connect');
  }, [navigate]);

  useEffect(() => {
    if (!currentRoom) {
      leavePage();
    }
  }, [currentRoom]);

  // Mute code from https://stackoverflow.com/a/34484987
  const [micMuted, setMicMuted] = useState(false);
  const muteMic = () => {
    ownStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicMuted(!micMuted);
  }

  const [camMuted, setCamMuted] = useState(false);
  const muteCam = () => {
    ownStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCamMuted(!camMuted);
  }

  useEffect(() => {
    socket.removeAllListeners("room_ended");
    socket.on("room_ended", () => {
      leavePage();
    })

    return () => {
      socket.removeAllListeners("room_ended")
      socket.emit("leave_room");
      setStreams([]);
    }
  }, [setStreams, leavePage]);

  return <div>
    <Nav isLoggedIn={true}>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <span className="fw-bold">Room</span>: {currentRoom || ""}
        </Navbar.Text>
        <Button id="leave_btn" className="ms-3" variant="outline-danger" size="sm" onClick={leavePage}>Leave</Button>
      </Navbar.Collapse>
    </Nav>
    <Container fluid className="d-flex pb-3 pt-2 px-3"
      style={{ height: "calc(100vh - 56px)" }}>
      <div className="d-flex flex-column " style={{ flex: 1 }}>
        <div id="video-list" className="border d-flex flex-column flex-grow-1 pt-2 px-1" >
          <div className="video-list-wrapper">
            {streams.map((stream, key) => <VideoBox stream={stream.stream} muted={stream.peerId === ""} key={key} />)}
          </div>
        </div>
          <div className="mute p-1 border">
            <Button variant="outline-light" className={micMuted ? "muted-button ms-1" : "mute-button ms-1"} onClick={muteMic}></Button>
            <Button variant="outline-light" className={camMuted ? "on-button ms-2" : "off-button ms-2"} onClick={muteCam}></Button>
          </div>
      </div>
      <div className="border p-1" style={{ flex: 5 }}>
        <Whiteboard />
      </div>
    </Container>
  </div >;
};
