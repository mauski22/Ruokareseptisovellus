import React, { useState } from 'react';
import { Modal, Button, Nav, Tab, Form } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import FeaturedRecipes from './components/FeaturedRecipes';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { AuthProvider, useAuth } from './components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const App = () => {
  // State for the homepage
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const { login } = useAuth();
  // Placeholder for recipes data
  const [recipesData] = useState([
    // ... Your recipes data here
  ]);

  // Toggle modal visibility
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  // Login submit handler
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
      try {
        const response = await fetch("http://localhost:8081/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput
          })
        });
        const result = await response.json();
        console.log(result);
        if (response.ok) {
          console.log("LOGIN SUCCESSFUL", result);
          login({ name: result.name });
          toggleLoginModal(); // Close the modal on successful login
        } else {
          console.error("Login failed", result.message);
        }
      } catch (error) {
        console.error("An error occurred during login", error);
      }
  };

  // Register submit handler
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nicknameInput, name: nameInput, email: emailInput, password: passwordInput, user_role: 'user' }),
      });
      const result = await response.json();
      console.log("Registration Success:", result);
      toggleRegisterModal();
      // Handle success (e.g., navigating to a different page, showing a success message)
    } catch (error) {
      console.error("Registration Failed:", error);
      // Handle error (e.g., showing an error message)
    }
  };

  return (
      <div className="App">
          <NavigationBar onLoginClicked={toggleLoginModal} onSignUpClicked={toggleRegisterModal} />
          <SearchBar />
          <FeaturedRecipes recipes={recipesData} />

          {/* Login Modal */}
          <Modal show={showLoginModal} onHide={toggleLoginModal}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LoginComponent
                handleLoginSubmit={handleLoginSubmit}
                setEmailInput={setEmailInput}
                setPasswordInput={setPasswordInput}
                emailInput={emailInput}
                passwordInput={passwordInput}
              />
            </Modal.Body>
          </Modal>

          {/* Register Modal */}
          <Modal show={showRegisterModal} onHide={toggleRegisterModal}>
            <Modal.Header closeButton>
              <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <RegisterComponent
                handleRegisterSubmit={handleRegisterSubmit}
                setNicknameInput={setNicknameInput}
                setNameInput={setNameInput}
                setEmailInput={setEmailInput}
                setPasswordInput={setPasswordInput}
                nicknameInput={nicknameInput}
                nameInput={nameInput}
                emailInput={emailInput}
                passwordInput={passwordInput}
              />
            </Modal.Body>
          </Modal>
    </div>
  );
};

export default App;
