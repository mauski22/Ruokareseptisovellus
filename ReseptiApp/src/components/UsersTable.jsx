//UsersTable.jsx
import React, { useState, useEffect } from 'react';


const UsersTable = () => {
    const [data, setData] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8081/users')
        .then(res=>res.json())
        .then(data=>setData(data))
        .catch(err=>console.log(err));
      }, [])
    return(
        <div style={{padding: "50px"}}>
            <table className='table'>
                <thead>
                    <th>USER_ID</th>
                    <th>NICKNAME</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PASSWORD</th>
                    <th>USER_ROLE</th>
                </thead>
                <tbody>
                    {data.map((d,i)=>(
                        <tr key={i}>
                        <td>{d.user_id}</td>
                        <td>{d.nickname}</td>
                        <td>{d.name}</td>
                        <td>{d.email}</td>
                        <td>{d.password}</td>
                        <td>{d.user_role}</td>
                        <td>
                            <button className='btn btn-sm btn-primary'>Update</button>
                            <button className='btn btn-sm btn-primary'>Delete</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default UsersTable