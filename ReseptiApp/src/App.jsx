import React, { useState } from 'react';
import { Modal, Button, Nav, Tab, Form, Image } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import FeaturedRecipes from './components/FeaturedRecipes';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { AuthProvider, useAuth } from './components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UsersTable from './components/UsersTable';
import { Route, Routes } from 'react-router-dom';
import RecipeDisplay from './components/RecipeDisplay';
import ResetPassword from './components/ResetPassword';
import Changepassword from './components/Changepasswordform';


const App = () => {
  // State for the homepage
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  // Toggle modal visibility
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  // Login submit handler
  
  return (
      <div className="App search-bar">
        <NavigationBar onLoginClicked={toggleLoginModal} onSignUpClicked={toggleRegisterModal} />
      <Routes>
        <Route path="/usersTable" element={<UsersTable />} />
        <Route path="/recipes" element={<RecipeDisplay />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/PasswordReset/:id/:name' element ={<Changepassword/>}/>
        {/* other routes here */}
        <Route path="/" element={
        
          <>
            <SearchBar />
            {/* your modals here */}
          </>
        } />
      </Routes>
          {/* Login Modal */}
          <Modal show={showLoginModal} onHide={toggleLoginModal}>
            <Modal.Header closeButton>
              <Modal.Title>Kirjaudu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LoginComponent
                handleCloseForm={toggleLoginModal}
                handleResetLinkClick={!showLoginModal}
              />
            </Modal.Body>
          </Modal>

          {/* Register Modal */}
          <Modal show={showRegisterModal} onHide={toggleRegisterModal}>
            <Modal.Header closeButton>
              <Modal.Title>Rekisteröidy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <RegisterComponent
                handleCloseForm={toggleRegisterModal}
              />
            </Modal.Body>
          </Modal>
    </div>
      );
};

export default App;

