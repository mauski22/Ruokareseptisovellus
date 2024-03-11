import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const LoginComponent = ({ handleLoginSubmit, setEmailInput, setPasswordInput, emailInput, passwordInput, handleCloseForm }) => {

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
        Login
      </Button>
      <Button variant="danger" onClick={handleCloseForm}>Cancel</Button>
    </Form>
  );
};

export default LoginComponent;
