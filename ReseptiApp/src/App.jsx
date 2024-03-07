import React, { useState } from 'react';
import { Modal, Button, Nav, Tab, Form } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import FeaturedRecipes from './components/FeaturedRecipes';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // State for the homepage
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  // Placeholder for recipes data
  const [recipesData] = useState([
    // ... Your recipes data here
  ]);

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
    setActiveTab('login'); // Reset to login tab by default when modal is toggled
  };

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
      console.log("LOGIN ONNISTUI", result);
      toggleModal(); // Close the modal on successful login
    } catch (error) {
      console.error("Jokin meni pieleen login hommelissa", error);
    }
  };

  // Register submit handler
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    // Implement your register logic here
    // This should be similar to handleLoginSubmit, but posting to a different endpoint
  };

  return (
    <div className="App">
      <NavigationBar onLoginClicked={toggleModal} />
      <SearchBar />
      <FeaturedRecipes recipes={recipesData} />

      {/* Login/Register Modal */}
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{activeTab === 'login' ? 'Login' : 'Register'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav variant="tabs" defaultActiveKey="login">
            <Nav.Item>
              <Nav.Link eventKey="login" onSelect={() => setActiveTab('login')}>
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register" onSelect={() => setActiveTab('register')}>
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="login" active={activeTab === 'login'}>
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group>
                  <Form.Control
                    type="email"
                    placeholder="Sähköpostiosoite"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="password"
                    placeholder="Salasana"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Kirjaudu
                </Button>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="register" active={activeTab === 'register'}>
              <Form onSubmit={handleRegisterSubmit}>
                {/* Repeat similar structure for registration as login */}
                {/* Add other fields as necessary for registration */}
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
