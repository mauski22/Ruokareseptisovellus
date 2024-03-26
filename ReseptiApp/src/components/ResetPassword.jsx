import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/sendrecoveryemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
      });
      const data = await response.json();
      console.log(data);
      alert("Salasanan palautuslinkin pitäisi löytyä sähköpostistasi")
    } catch (error) {
      console.error(error);
      alert("Sähköpostiosoitetta ei löytynyt");
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Sähköposti</Form.Label>
        <Form.Control
          type="email"
          placeholder="Anna sähköpostiosoite"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Lähetä palautuslinkki
      </Button>
    </Form>
  );
};

export default ResetPassword;