import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Outlet, useNavigate } from "react-router-dom";

import userImage from "../../../images/user.png";
import { useContext, useEffect } from "react";

import { getUser } from "../../services/usersService";
import { UserContext } from "../../contexts/UserContext";

const InstructorLayout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();



  const handleLogout = () => {
    if (confirm("Confirm logout?")) {
      setUser({ email: null, name: null, picture: null, role: null });
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-3">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user.token ? (
                <>
                  <Image
                    src={userImage || user.image}
                    style={{ width: "40px", height: "40px" }}
                    className="me-2"
                  ></Image>
                  <Navbar.Text>{user.name}</Navbar.Text>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default InstructorLayout;
