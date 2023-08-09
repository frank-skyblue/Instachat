import React, { FormEvent, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Card, Container, Button, Alert } from "react-bootstrap"
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "./helpers/queries";
import { Nav } from './components/Nav'
import { displayAlert } from "./helpers/alert";

export const Signup: React.FC = () => {
  const [signup, { data, loading, error }] = useMutation(SIGN_UP);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const form = useRef<HTMLFormElement>(null)

  const register = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    signup({ variables: { username, email, password } });
    form.current?.reset();
  }

  return (
    <div>
      <Nav isLoggedIn={false} />
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <Card className="p-1">
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {displayAlert(data, loading, error, "User is registered. Please check your email to verify account")}
              <Form onSubmit={register} ref={form}>
                <Form.Group className="mb-3" controlId="userEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                  <Form.Text className="text-muted">
                    What you will use to log into InstaChat.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="userName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                  <Form.Text className="text-muted">
                    What other users will see you as.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="userPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="outline-dark" type="submit">
                    Sign up
                  </Button>
                </div>

                <div className="mt-2">
                  <Link to="/" className="w-100 text-center text-black-50">
                    Already have an account? Login
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};
