// RecipeMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const RecipeMenu = ({ onClick }) => {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() =>{ navigate('/usersOwnRecipes'); onClick(); }}>OMAT IDEAT</button>
            <button onClick={() =>{ navigate('/allRecipes'); onClick(); }}>KAIKKI IDEAT</button>      
            <button onClick={() =>{ navigate('/favoriteRecipes'); onClick(); }}>OSTETUT IDEAT</button>      
        </div>
    );
}
export default RecipeMenu;