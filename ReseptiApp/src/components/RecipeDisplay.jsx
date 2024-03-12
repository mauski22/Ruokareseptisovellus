import React from 'react';
import { useAuth } from './AuthContext';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
export const RecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/reseptienIDEIDENHAKU/${user.user_id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const recipeIds = await response.json();
        const recipeData = [];

        for (let recipe of recipeIds) {
          const recipeResponse = await fetch(`http://localhost:8081/kayttajanreseptienhaku/${recipe.recipe_id}`);
          if (!recipeResponse.ok) throw new Error('Network response was not ok');
          const recipeDetails = await recipeResponse.json();
          console.log(recipeDetails);
          recipeData.push(recipeDetails);
        }
        console.log("Reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData)
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipes();
  }, []);
  useEffect(() => {
    console.log("Reseptien data on päivittynyt:", recipes);
  }, [recipes]);
  return (
    <div>
      {console.log("RENDERING WITH RECIPES", recipes)}
      {recipes.flat().map((recipe, index) => (
        <div key={index}>
          <h2>{recipe.title}</h2>
          {console.log("RESEPTIN TITTELIIIIII", recipe.recipe_id)}
          <p>{recipe.description}</p>
          <p>Author ID: {recipe.author_id}</p>
          <p>Visibility: {recipe.visibility}</p>
          <p>Created at: {recipe.created_at}</p>
          <p>Updated at: {recipe.updated_at}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeDisplay;

