import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { getUserCookie } from "../helpers/cookie";

interface Props { isLoggedIn: boolean }

export const Nav: React.FC<Props> = ({ isLoggedIn, children }) => {
  return <div>
    <Navbar>
      <Container fluid>
        <Navbar.Brand href="/">InstaChat</Navbar.Brand>
        <Navbar.Toggle />
        {isLoggedIn ?
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="/">{getUserCookie()}</a>
            </Navbar.Text>
            {children}
          </Navbar.Collapse> :
          <></>
        }
      </Container>
    </Navbar>
  </div>
}