import React from 'react';
import { Form, Button } from 'react-bootstrap';

const RegisterComponent = ({
  handleRegisterSubmit,
  setNicknameInput,
  setNameInput,
  setEmailInput,
  setPasswordInput,
  nicknameInput,
  nameInput,
  emailInput,
  passwordInput,
}) => {
  return (
    <Form onSubmit={handleRegisterSubmit}>
      <Form.Group className="mb-3" controlId="formNickname">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={nicknameInput}
          onChange={(e) => setNicknameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRealName">
        <Form.Label>Your Real Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your real name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default RegisterComponent;
