//NavigationBar.jsx
import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Modal, OverlayTrigger, Popover, Dropdown } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import AddRecipeForm from './AddRecipeForm';
import ConfirmModal from './Confirmation';
import { useNavigate } from 'react-router-dom';
import RecipeMenu from './RecipeMenu';




const NavigationBar = ({ onLoginClicked, onSignUpClicked }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);


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
  const handlePopoverClick = () => {
    setShowPopover(!showPopover);
  };

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  return (
    <>
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Idea Market</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact>Etusivu</Nav.Link>
            {isLoggedIn && (
                <OverlayTrigger
                  show={showPopover}
                  trigger="click"
                  placement="bottom"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Body>
                        <RecipeMenu  onClick={handleClosePopover}/>
                      </Popover.Body>
                    </Popover>
                  }
                  rootClose={true}
                  onHide={handleClosePopover}
                >
                  <Nav.Link onClick={handlePopoverClick}>Ideat</Nav.Link>
                </OverlayTrigger>
              )}
            {!isLoggedIn && (
              <Nav.Link as={NavLink} to="/publicRecipes">Selaa Ideoita</Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link as={NavLink} to="/Person">Yksityishenkilön näkymä</Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link as ={NavLink} to="/Company">Yritysnäkymä</Nav.Link>
            )}
            {isLoggedIn && (
              <Button variant="primary" onClick={handleShowAddRecipeForm}>Lisää idea</Button>
            )}
            {isLoggedIn && isSuperAdmin && (
              <Nav.Link as={NavLink} to="/usersTable">{"("}ADMIN{")"}</Nav.Link>
            )}

          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  Kirjauduttu sisään: {user.userName} {isSuperAdmin ? 'YRITYS' : 'Jäsen'}
                </Navbar.Text>
                <Button onClick={handleShowConfirmModal} variant="outline-danger">Kirjaudu ulos</Button>
              </>
            ) : (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-login">
                    Kirjaudu
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => onLoginClicked('individual')}>Kirjaudu Yksityishenkilönä</Dropdown.Item>
                    <Dropdown.Item onClick={() => onLoginClicked('company')}>Kirjaudu Yrityksenä</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
          <Modal.Title>Lisää uusi idea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRecipeForm user={user} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;

