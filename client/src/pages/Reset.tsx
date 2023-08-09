import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { Container, Card, Form, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom';
import { Nav } from "./components/Nav";
import { displayAlert } from "./helpers/alert";
import { RESET } from "./helpers/queries";

export const Reset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [reset, { data, loading, error }] = useMutation(RESET);
  const { token } = useParams();

  const resetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset({ variables: { token, password, confirm } })
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
              {displayAlert(data, loading, error, "Password has been reset. Please login")}
              <Form onSubmit={resetPassword}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Enter new password</Form.Label>
                  <Form.Control type="password" placeholder="New password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm">
                  <Form.Label>Confirm new password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)} />
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