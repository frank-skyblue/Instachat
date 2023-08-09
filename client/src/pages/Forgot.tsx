import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Nav } from "./components/Nav";
import { displayAlert } from "./helpers/alert";
import { FORGOT } from "./helpers/queries";

export const Forgot: React.FC = () => {
  const [email, setEmail] = useState('');
  const [forgot, { data, loading, error }] = useMutation(FORGOT);

  const forgotPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgot({ variables: { email } });
  }

  return (
    <div>
      <Nav isLoggedIn={false} />
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <Card className="p-1">
            <Card.Body>
              <h2 className="text-center mb-4">Reset Password</h2>
              {displayAlert(data, loading, error, "Password reset email has been sent")}
              <Form onSubmit={forgotPassword}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Please enter your email below</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="outline-dark" type="submit">
                    Submit
                  </Button>
                </div>

                <div className="mt-2">
                  <Link to="/" className="w-100 text-center text-black-50">
                    Click here to login
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}