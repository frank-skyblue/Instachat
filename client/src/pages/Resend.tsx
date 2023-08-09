import React, { FormEvent, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Form, Button } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { Nav } from "./components/Nav";
import { RESEND } from "./helpers/queries";
import { displayAlert } from "./helpers/alert";

export const Resend: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resend, { data, loading, error }] = useLazyQuery(RESEND);
  const form = useRef<HTMLFormElement>(null);

  const resendEmail = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    resend({ variables: { email } })
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
              <h2 className="text-center mb-4">Resend Verification Email</h2>
              {displayAlert(data, loading, error, "Email sent. Please check your inbox and spam folders")}
              <Form onSubmit={resendEmail} ref={form}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Please enter your email below</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="outline-dark" type="submit">
                    Resend
                  </Button>
                </div>

                <div className="mt-2 text-center">
                  <Link to="/" className="w-100 text-center text-black-50">
                    Click to sign in
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