// RecipeMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const RecipeMenu = ({ onClick }) => {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() =>{ navigate('/usersOwnRecipes'); onClick(); }}>OMAT RESEPTIT</button>
            <button onClick={() =>{ navigate('/allRecipes'); onClick(); }}>KAIKKI RESEPTIT</button>            
        </div>
    );
}
export default RecipeMenu;