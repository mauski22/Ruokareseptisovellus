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
import RecipeCard from './components/RecipeCard';
import ResetPassword from './components/ResetPassword';
import Changepassword from './components/Changepasswordform';


const App = () => {
  // State for the homepage
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailError, setEmailError] = useState("");
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
      const vastaus = await fetch("http://localhost:8081/login",  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      }
      )
      const tulos = await vastaus.json();
      if (tulos === "Login failed") {
        console.log(tulos);
        alert("Sähköposti tai salasana oli väärin. Yritä uudelleen.")
      } else {
        console.log("Käyttäjän ", tulos.userName + " kirjautuminen onnistui. ID = " + tulos.user_id + ", ROOLI = " + tulos.userRole);
        login(tulos);
        setEmailInput('');
        setPasswordInput('');
        toggleLoginModal();
      }
    }
    catch (error) {
      console.log("Jokin meni pieleen login hommelissa")
      console.log("ERROR LOGIN ", error);
    }
  };

  
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nicknameInput, name: nameInput, email: emailInput, password: passwordInput, user_role: 'user' }),
      });

      if (!response.ok){
      const result = await response.json();
      console.log("Registration Failed:", result);
      if(result === "Sähköposti on jo käytössä") {
        setEmailError(result);
      }
      throw new Error(result);
      }
      const result = await response.json();
      console.log("Registration Success: ", result);
      setEmailError("");
      toggleRegisterModal();
      
    } catch (error) {
      console.error("Registration Failed:", error);
    }
  };

  return (
      <div className="App search-bar">
        <NavigationBar onLoginClicked={toggleLoginModal} onSignUpClicked={toggleRegisterModal} />
      <Routes>
        <Route path="/usersTable" element={<UsersTable />} />
        <Route path="/recipes" element={<RecipeCard />} />
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
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LoginComponent
                handleLoginSubmit={handleLoginSubmit}
                setEmailInput={setEmailInput}
                setPasswordInput={setPasswordInput}
                emailInput={emailInput}
                passwordInput={passwordInput}
                handleCloseForm={toggleLoginModal}
                handleResetLinkClick={!showLoginModal}
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
                setEmailError={setEmailError}
                setPasswordInput={setPasswordInput}
                nicknameInput={nicknameInput}
                nameInput={nameInput}
                emailInput={emailInput}
                emailError={emailError}
                passwordInput={passwordInput}
                handleCloseForm={toggleRegisterModal}
              />
            </Modal.Body>
          </Modal>
    </div>
      );
};

export default App;

