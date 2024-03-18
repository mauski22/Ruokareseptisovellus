// RecipeMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeDisplay from './RecipeDisplay';
import PublicRecipeDisplay from './PublicRecipeDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';

export const RecipeMenu = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/usersOwnRecipes')}>OMAT RESEPTIT</button>
            <button onClick={() => navigate('/publicRecipes')}>JULKISET RESEPTIT</button>            
        </div>
    );
}

export default RecipeMenu;