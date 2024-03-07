import { useState } from 'react'
import './App.css'

export function Register () {
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch("http://localhost:8081/register", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              nickname: nicknameInput,
              name: nameInput,
              email: emailInput,
              password: passwordInput,
              user_role: 'user'}),
          });
          const result = await response.json(); 
          console.log("JEEEEEEEEEEEE" + result);
        } catch (error) {
          console.log("JOKIN MENI VITUIKSI")
          console.error("Error:", error);
    }
    };
    const [nicknameInput, setNicknameInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    return <>
    <form onSubmit={handleRegisterSubmit}>
    <input  onChange={(e) => setNicknameInput(e.target.value) } name = 'nickname' type="text" placeholder="Käyttäjänimi" />
    <input  onChange={(e) => setNameInput(e.target.value)}  type="text" name='name' placeholder="Oikea nimesi" />
    <input  onChange={(e => setEmailInput(e.target.value))}  type="email" name = 'email' placeholder="Sähköpostiosoite" />
    <input onChange={(e) => setPasswordInput(e.target.value)}  type="password" name = 'password' placeholder="Salasana" />
    <button type="submit">Luo käyttäjä</button>
    </form>
    </>
}