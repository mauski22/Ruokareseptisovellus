import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const NavigationBar = ({ onLoginClicked }) => {
  return (
    <Navbar bg="light" expand="lg" className="justify-content-start">
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
            <Nav.Link href="#login" onClick={onLoginClicked}>Log In</Nav.Link>
            <Nav.Link href="#signup" onClick={onLoginClicked}>Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
