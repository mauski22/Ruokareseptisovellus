import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const RegisterComponent = ({
  handleRegisterSubmit,
  setNicknameInput,
  setNameInput,
  setEmailInput,
  setPasswordInput,
  setEmailError,
  nicknameInput,
  nameInput,
  emailInput,
  emailError,
  passwordInput,
  handleCloseForm,
}) => {
  return (
    <Form onSubmit={handleRegisterSubmit}>
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
          onChange={(e) => {setEmailInput(e.target.value), setEmailError("")} } isInvalid ={!!emailError}
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
  );
};

export default RegisterComponent;
