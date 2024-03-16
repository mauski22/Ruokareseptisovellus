import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    let {id} = useParams();  
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Salasanat eivät täsmää!');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8081/salasananpalautus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: password, user_id: id})
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert('Salasana on vaihdettu onnistuneesti!');
            } else {
                alert('Salasanan vaihto epäonnistui. Yritä uudelleen.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>     
         <h1 style={{color: "orange"}}>
        Vaihda salasana
          </h1>
            <Form onSubmit={handlePasswordChange}>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Uusi salasana:</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Vahvista salasana:</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Vaihda salasana
                </Button>
            </Form>
        </Container>
    );
};

export default PasswordReset;