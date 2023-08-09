import React, { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Card, Container, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { SIGN_IN } from "./helpers/queries";
import { Nav } from './components/Nav'
import socket, { connectSocket } from "./helpers/socket";
import { appContext } from "../App";

export const Signin: React.FC = () => {
  const [signin, { error }] = useMutation(SIGN_IN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setSignedIn } = useContext(appContext)!;

  const login = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await signin({ variables: { email, password } });
      setSignedIn(true);
      if (!socket.connected) {
        await connectSocket();
      }
      navigate("/connect");
    } catch (e) {
    }
  }

  return (
    <div>
      <Nav isLoggedIn={false} />
      <Container className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <Card className="p-1">
            <Card.Body>
              <h2 className="text-center mb-4">Sign In</h2>
              {error && (<Alert variant="danger">{error.message}</Alert>)}
              <Form onSubmit={login}>
                <Form.Group className="mb-3" controlId="userEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-4" controlId="userPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="outline-dark" type="submit">
                    Sign in
                  </Button>
                </div>

                <div className="mt-2">
                  <Link to="/signup" className="w-100 text-center text-black-50">
                    Don't have an account yet? Sign up
                  </Link>
                </div>
                <div className="mt-2">
                  <Link to="/forgot" className="w-100 text-center text-black-50">
                    Forgot password? Click here to reset
                  </Link>
                </div>
                <div className="mt-2">
                  <Link to="/resend" className="w-100 text-center text-black-50">
                    Not verified? Resend verification email
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
        <Link to="/credits">Credits</Link>
      </Container>
    </div>
  );
};
