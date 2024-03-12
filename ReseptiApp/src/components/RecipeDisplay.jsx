import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard'; // Adjust the path as needed
import { useAuth } from './AuthContext';

const RecipeDisplay = ({ recipeId }) => {
  const [recipe, setRecipe] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8081/reseptienIDEIDENHAKU/${user.user_id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data)
        setRecipe(data[0]); // Assuming the API returns an array with one object
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]); // Re-fetch when recipeId changes

  // This part remains the same. It ensures that the fetched recipe data
  // is passed correctly to the RecipeCard component.
  return (
    <div>
      {recipe ? (
        <RecipeCard
          title={recipe.title}
          time={`${recipe.created_at}`} // Adjust according to your database fields
          ingredients={recipe.ingredients}
          instructions={recipe.instructions}
          tags={recipe.tags} 
          imageUrl={recipe.image_url} // Make sure to adjust according to your database field
        />
      ) : (
        <p>Loading recipe...</p>
      )}
    </div>
  );
};

export default RecipeDisplay;
