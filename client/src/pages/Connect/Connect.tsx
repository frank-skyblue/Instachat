import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Card, Container, Button, Alert } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { Nav } from "../components/Nav";
import { getUserCookie } from "../helpers/cookie";
import socket from "../helpers/socket";
import { PeerStream, appContext } from "../../App";
import { SIGN_OUT } from "../helpers/queries";
import "./Connect.css";

export const Connect: React.FC = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const { setCurrentRoom, setStreams, ownStream, setSignedIn } = useContext(appContext)!;
  const navigate = useNavigate();

  const [signOutApollo] = useLazyQuery(SIGN_OUT);

  useEffect(() => {
    socket.removeAllListeners("room_started");
    socket.on("room_started", ({ roomId }) => {
      setCurrentRoom(roomId);
      navigate("/whiteboard");
    });

    socket.removeAllListeners("room_joined");
    socket.on("room_joined", () => {
      navigate("/whiteboard");
    });

    socket.removeAllListeners("already_in_room");
    socket.on("already_in_room", () => {
      setAlertType("danger");
      setMessage("You are already in a room");
    });

    socket.removeAllListeners("no_room");
    socket.on("no_room", () => {
      setAlertType("danger");
      setMessage("Room does not exist");
    });

    return function cleanup() {
      socket.removeAllListeners("room_started");
      socket.removeAllListeners("room_joined");
      socket.removeAllListeners("already_in_room");
      socket.removeAllListeners("no_room");
    };
  }, [navigate, setCurrentRoom]);

  const startRoom = () => {
    addOwnStream();
    setAlertType("primary");
    setMessage("Starting...");
    socket.emit("start_room");
  };

  const joinRoom = () => {
    addOwnStream();
    setAlertType("primary");
    setMessage("Joining...");
    socket.emit("join_room", { room });
    setCurrentRoom(room);
  };

  const addOwnStream = () => {
    if (ownStream) {
      setStreams((streams) => {
        const newStreams = streams.concat();
        if (!newStreams.find(stream => stream.peerId === "")) {
          const ownPeerStream: PeerStream = { peerId: "", stream: ownStream };
          newStreams.unshift(ownPeerStream);
        }
        return newStreams;
      });
    }
  };

  const signOut = async () => {
    await signOutApollo();
    setSignedIn(false);
    navigate('/');
  }

  return (
    <div>
      <Nav isLoggedIn={!!getUserCookie()}>
        <Button className="ms-2 signoutButton" variant="outline-white" onClick={signOut}></Button>
      </Nav>
      <Container
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card className="p-1">
            {message && <Alert variant={alertType} dismissible onClose={() => setMessage("")}>{message}</Alert>}
            <Card.Body>
              <Form>
                <Form.Group className="mb-4">
                  <Button variant="outline-dark" onClick={startRoom}>
                    Start Own Room
                  </Button>
                </Form.Group>
                <hr className="mt-2 mb-3" />
                <Form.Group className="mb-4">
                  <Form.Label>Room ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Room Id"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </Form.Group>
                <Button variant="outline-primary" onClick={joinRoom}>
                  Join Room
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
        <Link to="/credits">Credits</Link>
      </Container >
    </div >
  );
};
