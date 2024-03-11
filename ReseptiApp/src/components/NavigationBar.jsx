import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import AddRecipeForm from './AddRecipeForm';
import ConfirmModal from './Confirmation';


const NavigationBar = ({ onLoginClicked, onSignUpClicked }) => {
  const { user, logout } = useAuth();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = () => {
    setShowConfirmModal(true);
    logout();
    setShowConfirmModal(false);

  };

  const location = useLocation();
  const isRecipesPage = location.pathname === '/recipes';
  const isLoggedIn = user !== null;
  //const isSuperAdmin = user.user_role === 'superadmin';

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
            <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
            <Nav.Link as={NavLink} to="/community">Community</Nav.Link>
            <Nav.Link as={NavLink} to="/usersTable" >Käyttäjien hallinta</Nav.Link>
            {/*{isSuperAdmin && isLoggedIn && (
            )}
            */}
            {isRecipesPage && isLoggedIn && (
              <Button variant="primary" onClick={handleShowAddRecipeForm}>Add recipe</Button>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  Signed in as: {user.userName} {/* Consider updating this to use NavLink or a more appropriate approach */}
                </Navbar.Text>
                <Button onClick={handleShowConfirmModal} variant="outline-danger">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={onLoginClicked} variant="primary">Log In</Button> {/* Adjust as necessary for your login logic */}
                <Button onClick={onSignUpClicked} variant="secondary">Register</Button> {/* Adjust as necessary for your signup logic */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <ConfirmModal
        show={showConfirmModal}
        handleClose={handleCloseConfirmModal}
        title="Confirm Logout"
        body="Are you sure you want to logout?"
        confirmAction={handleLogout}
      />
    <Modal show={showAddRecipeModal} onHide={handleCloseAddRecipeForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRecipeForm user={user} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;

