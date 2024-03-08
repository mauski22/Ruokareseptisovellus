import React from 'react';
import { Form, Button } from 'react-bootstrap';

const LoginComponent = ({ handleLoginSubmit, setEmailInput, setPasswordInput, emailInput, passwordInput }) => {
  return (
    <Form onSubmit={handleLoginSubmit}>
      <Form.Group>
        <Form.Control
          type="email"
          placeholder="Email Address"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
      <Button variant="danger">Cancel</Button>
    </Form>
  );
};

export default LoginComponent;
