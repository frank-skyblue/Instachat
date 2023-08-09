import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { Nav } from "./components/Nav";
import { VERIFY } from "./helpers/queries";
import { displayAlert } from "./helpers/alert";

export const Verify: React.FC = () => {
  const { token } = useParams();
  const [verify, { data, loading, error }] = useMutation(VERIFY);

  useEffect(() => {
    verify({ variables: { token } })
  }, [])

  return (
    <div>
      <Nav isLoggedIn={false} />
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          {displayAlert(data, loading, error, "Verification succeeded. Please login")}
          <div className="mt-2 text-center">
            <Link to="/" className="w-100 text-center text-black-50">
              Click to sign in
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}