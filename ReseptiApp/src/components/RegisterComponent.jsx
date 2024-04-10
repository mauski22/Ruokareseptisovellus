import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const RegisterComponent = ({ handleCloseForm }) => {
  const [nicknameInput, setNicknameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailError, setEmailError] = useState("");
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [companyRegistering, setCompanyRegistering] = useState(false);
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
      handleCloseForm();
      
    } catch (error) {
      console.error("Registration Failed:", error);
    }
  };

  return (
    companyRegistering ? (
      <Form onSubmit={handleRegisterSubmit}>
      <Form.Label>Haluatko rekisteröityä ideamyyjänä?{'  '}
      </Form.Label>
      <Button onClick={() =>{setCompanyRegistering(!companyRegistering);}}>
        Myyjän rekisteröintiin
      </Button>
      <Form.Group className="mb-3" controlId="formNickname">
        <Form.Label>Yrityksen nimi</Form.Label>
        <Form.Control
          type="text"
          placeholder="Syötä yrityksen nimi"
          value={nicknameInput}
          onChange={(e) => setNicknameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRealName">
        <Form.Label>Yrityksen Y-Tunnus</Form.Label>
        <Form.Control
          type="text"
          placeholder="Syötä yrityksen Y-Tunnus"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Sähköposti</Form.Label>
        <Form.Control
          type="email"
          placeholder="Syötä sähköposti"
          value={emailInput}
          onChange={(e) => { setEmailInput(e.target.value); setEmailError("") }}
          isInvalid={!!emailError}
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Salasana</Form.Label>
        <Form.Control
          type="password"
          placeholder="Syötä salasana"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Rekisteröidy
      </Button>
      <Button variant="danger" onClick={handleCloseForm}>Peruuta</Button>
    </Form>
      )
       : 
      (
    <Form onSubmit={handleRegisterSubmit}>
      <Form.Label>Haluatko rekisteröidä yrityksen?{'  '}
      </Form.Label>
      <Button onClick={() =>{setCompanyRegistering(!companyRegistering);}}>
        Yritysrekisteröintiin
      </Button>
      <Form.Group className="mb-3" controlId="formNickname">
        <Form.Label>Käyttäjätunnus</Form.Label>
        <Form.Control
          type="text"
          placeholder="Syötä käyttäjätunnus"
          value={nicknameInput}
          onChange={(e) => setNicknameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRealName">
        <Form.Label>Koko Nimi</Form.Label>
        <Form.Control
          type="text"
          placeholder="Syötä koko nimi"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Sähköposti</Form.Label>
        <Form.Control
          type="email"
          placeholder="Syötä sähköposti"
          value={emailInput}
          onChange={(e) => { setEmailInput(e.target.value); setEmailError("") }}
          isInvalid={!!emailError}
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Salasana</Form.Label>
        <Form.Control
          type="password"
          placeholder="Syötä salasana"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Rekisteröidy
      </Button>
      <Button variant="danger" onClick={handleCloseForm}>Peruuta</Button>
    </Form> )
  );
};

export default RegisterComponent;
