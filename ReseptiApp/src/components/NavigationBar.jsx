//NavigationBar.jsx
import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import AddRecipeForm from './AddRecipeForm';
import ConfirmModal from './Confirmation';
import { useNavigate } from 'react-router-dom';



const NavigationBar = ({ onLoginClicked, onSignUpClicked }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleLogout = () => {
    setShowConfirmModal(true);
    logout();
    navigate('/');
    setShowConfirmModal(false);
  };

  const location = useLocation();
  const isRecipesPage = location.pathname === '/recipes';
  const isLoggedIn = user !== null;
  let isSuperAdmin = false;
  if(isLoggedIn){
    isSuperAdmin = user.userRole === "superadmin";
  }
  
  const handleShowAddRecipeForm = () => setShowAddRecipeModal(true);
  const handleCloseAddRecipeForm = () => setShowAddRecipeModal(false);

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };


  return (
    <>
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Ruokareseptisovellus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact>Etusivu</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes">Reseptit</Nav.Link>
            {isLoggedIn && isSuperAdmin && (
              <Nav.Link as={NavLink} to="/usersTable">{"("}ADMIN{")"}</Nav.Link>
            )}
            {isRecipesPage && isLoggedIn && (
              <Button variant="primary" onClick={handleShowAddRecipeForm}>Lisää resepti</Button>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  Kirjauduttu sisään: {user.userName} {"("}{user.userRole}{")"} {/* Consider updating this to use NavLink or a more appropriate approach */}
                </Navbar.Text>
                <Button onClick={handleShowConfirmModal} variant="outline-danger">Kirjaudu ulos</Button>
              </>
            ) : (
              <>
                <Button onClick={onLoginClicked} variant="primary">Kirjaudu</Button> {/* Adjust as necessary for your login logic */}
                <Button onClick={onSignUpClicked} variant="secondary">Rekisteröidy</Button> {/* Adjust as necessary for your signup logic */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <ConfirmModal
        show={showConfirmModal}
        handleClose={handleCloseConfirmModal}
        title="Vahvista uloskirjautuminen"
        body="Haluatko varmasti kirjautua ulos"
        confirmAction={handleLogout}
      />
    <Modal show={showAddRecipeModal} onHide={handleCloseAddRecipeForm}>
        <Modal.Header closeButton>
          <Modal.Title>Lisää uusi resepti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRecipeForm user={user} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;

