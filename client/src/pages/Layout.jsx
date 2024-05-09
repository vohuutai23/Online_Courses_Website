import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import userImage from "../../images/user.png";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import Role from "../../../server/models/RoleEnum.js";
import InstructorLayout from "../Components/InstructorLayout";
import AdminLayout from "../Components/AdminLayout.jsx";
import NavDropdown from "react-bootstrap/NavDropdown";

const Layout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Confirm logout?")) {
      setUser({ email: null, name: null, picture: null, role: null });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-3">
        <Container>
          {user.role == Role.ADMIN ? (
            <Navbar.Brand href="/">Users Management</Navbar.Brand>
          ) : user.role == Role.INSTRUCTOR ? (
            <Navbar.Brand href="/">My Created Courses</Navbar.Brand>
          ) : (
            <Navbar.Brand href="/">Home</Navbar.Brand>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user.token ? (
                <>
                  {user.role == Role.ADMIN ? (
                    <AdminLayout />
                  ) : user.role == Role.INSTRUCTOR ? (
                    <InstructorLayout />
                  ) : (
                    <Nav.Link href="#action">My Courses</Nav.Link>
                  )}
                  <div className="d-flex align-items-center">
                    <Image
                      src={userImage || user.image}
                      style={{ width: "30px", height: "30px" }}
                      className="ms-2"
                    ></Image>
                  </div>
                  <NavDropdown title={user.name}>
                    <NavDropdown.Item href="/my-profile">
                      My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
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

export default Layout;
