import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const NavigationBar = ({ onLoginClicked, onSignUpClicked }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally, redirect the user to the homepage or perform other cleanup tasks
  };

  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand href="#home">Ruokareseptisovellus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#recipes">Recipes</Nav.Link>
            <Nav.Link href="#community">Community</Nav.Link>
            <Nav.Link href="#marketplace">Marketplace</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  Signed in as: <a href="#profile">{user.name}</a>
                </Navbar.Text>
                <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link href="#login" onClick={onLoginClicked}>Log In</Nav.Link>
                <Nav.Link href="#signup" onClick={onSignUpClicked}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

