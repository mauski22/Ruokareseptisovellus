import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginComponent = ({ handleLoginSubmit, setEmailInput, setPasswordInput, emailInput, passwordInput, handleCloseForm, handleResetLinkClick }) => {

  const onResetPasswordClick = (e) => {
    handleResetLinkClick(); // This will close the modal
    // If you're not using React Router or need to do additional logic before redirecting, handle it here
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
        Login
      </Button>
      <Button variant="danger" onClick={handleCloseForm}>Cancel</Button>
      <div className="mt-3">
        <Link to="/reset-password" onClick={onResetPasswordClick}>Unohditko salasanasi?</Link>
      </div>
    </Form>
  );
};

export default LoginComponent;
