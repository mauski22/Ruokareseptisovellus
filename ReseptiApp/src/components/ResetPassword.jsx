import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ResetPassword = ({ handleResetPasswordSubmit }) => {
  const [email, setEmail] = useState('');

  return (
    <Form onSubmit={(e) => handleResetPasswordSubmit(e, email)}>
      <Form.Group>
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Send Reset Link
      </Button>
    </Form>
  );
};

export default ResetPassword;