//UsersTable.jsx
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Container } from 'react-bootstrap';



const UsersTable = () => {
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [deletingRowIndex, setDeletingRowIndex] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:8081/users')
        .then(res=>res.json())
        .then(data=>setData(data))
        .catch(err=>console.log(err));
    }, [])
    const handleDelete = (index) => {
        const userId = data[index].user_id;
        fetch(`http://localhost:8081/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Deletion response was not ok');
            }
            // Assuming the server responds with a success status code
            // Remove the deleted user from the local state
            const updatedData = data.filter((_, i) => i !== index);
            setData(updatedData);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Optionally, show an error message to the user
        });
    };
    
    const handleEdit = (index) => {
        setEditingRowIndex(index);
        setEditingData({...data[index]});
    };
    const handleSave = (index) => {
        const userId = data[index].user_id;
        fetch(`http://localhost:8081/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('EDITING response was not ok');
            }
            return fetch('http://localhost:8081/users');
        })
        .then(res => res.json())
        .then(updatedData => {
            // Update the local state with the updated list of users
            setData(updatedData);
            setEditingRowIndex(null);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Optionally, show an error message to the user
        });
  
    };
    const handleCancel = () => {
        setEditingRowIndex(null);
    };
    const handleChange = (e, field) => {
        setEditingData({...editingData, [field]: e.target.value});
    };

    return(
        <div style={{padding: "50px"}}>
            <table className='table'>
                <thead>
                    <th>Käyttäjän ID</th>
                    <th>Käyttäjänimi</th>
                    <th>Koko nimi</th>
                    <th>Sähköpostiosoite</th>
                    <th>Salasana</th>
                    <th>Käyttäjäoikeus</th>
                </thead>
                <tbody>
                    {data.map((d, i) => (
                        <tr key={i}>
                            <td>{d.user_id}</td>
                            <td>
                                {editingRowIndex === i ? (
                                    <input type="text" value={editingData.nickname} onChange={(e) => handleChange(e, 'nickname')} />
                                ) : (
                                    d.nickname
                                )}
                            </td>
                            <td>
                                {editingRowIndex === i ? (
                                    <input type="text" value={editingData.name} onChange={(e) => handleChange(e, 'name')} />
                                ) : (
                                    d.name
                                )}
                            </td>
                            <td>{d.email}</td>
                            <td>
                                {editingRowIndex === i ? (
                                    <input type="text" value={editingData.password} onChange={(e) => handleChange(e, 'password')} />
                                ) : (
                                    d.password
                                )}
                            </td>
                            <td>
                                {editingRowIndex === i ? (
                                    <input type="text" value={editingData.user_role} onChange={(e) => handleChange(e, 'user_role')} />
                                ) : (
                                    d.user_role
                                )}
                            </td>
                            <td>
                                {editingRowIndex === i ? (
                                    <>
                                        <button className='btn btn-success' onClick={() => handleSave(i)}>Save</button>
                                        <button className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <button className='btn btn-warning' onClick={() => handleEdit(i)}>Edit</button>
                                )}
                                {editingRowIndex === null && (
                                    <button className='btn btn-danger' onClick={() => handleDelete(i)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>    
            </table>
        </div>
    );
}
export default UsersTable