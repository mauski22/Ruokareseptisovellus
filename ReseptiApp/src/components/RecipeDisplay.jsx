import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { useAuth } from './AuthContext';

const RecipeDisplay = () => {
  const [recipes, setRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Ensure the URL is correct and you're correctly passing the user ID
        const response = await fetch(`http://localhost:8081/reseptienIDEIDENHAKU/${user.user_id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecipes(data); // Assuming 'data' is an array of recipe objects
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    if (user && user.user_id) {
      fetchRecipes();
    }
  }, [user]); // Re-fetch when the user object changes

  return (
    <div>
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <RecipeCard
            key={recipe.recipe_id} // Ensure 'recipe_id' is the correct identifier
            title={recipe.title}
            time={recipe.time} // Adjust based on your data fields
            ingredients={recipe.ingredients} // Might need processing if not a string
            instructions={recipe.instructions}
            tags={recipe.tags} // Might need processing if not a string
            imageUrl={recipe.image_url} // Ensure this is correct based on your data
          />
        ))
      ) : (
        <p>No recipes found for this user.</p>
      )}
    </div>
  );
};

export default RecipeDisplay;
