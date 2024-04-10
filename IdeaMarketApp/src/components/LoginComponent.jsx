import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
const LoginComponent = ({ handleCloseForm }) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const { login } = useAuth();
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
      });

      const tulos = await vastaus.json();
      if (tulos === "Login failed") {
        console.log(tulos);
        alert("Sähköposti tai salasana oli väärin. Yritä uudelleen.")
      } else {
        console.log("Käyttäjän ", tulos.userName + " kirjautuminen onnistui. ID = " + tulos.user_id + ", ROOLI = " + tulos.userRole);
        login(tulos);
        setEmailInput('');
        setPasswordInput('');
        handleCloseForm();
      }
    }
    catch (error) {
      console.log("Jokin meni pieleen login hommelissa")
      console.log("ERROR LOGIN ", error);
    }
  };

  const onResetPasswordClick = (e) => {
    handleCloseForm();
    // Jos et käytä React Routeria tai tarvitset lisälogiikkaa ennen uudelleenohjausta, käsittele se täällä
  };

  return (
    <Form onSubmit={handleLoginSubmit}>
      <Form.Group>
        <Form.Control
          type="email"
          placeholder="Sähköposti"
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
      <Button variant="danger" onClick={handleCloseForm}>Peruuta</Button>
      <div className="mt-3">
        <Link to="/reset-password" onClick={onResetPasswordClick} style={{"color":"blue"}}>Unohditko salasanasi?</Link>
      </div>
    </Form>
  );
};

export default LoginComponent;