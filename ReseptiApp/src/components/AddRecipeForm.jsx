import React, { useState } from 'react';

const AddRecipeForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(0);
  const [recipesData] = useState([
    // ... Your recipes data here
  ]);

  const handleVisibilityChange = (newVisibility) => {
    if (newVisibility === 'public') {
      setVisibility(1);
    } else if (newVisibility === 'private') {
      setVisibility(0);
    }
  };

  const handleRecipeSubmit = async (event) => {
    event.preventDefault();
    const recipeData = {
      title: title,
      author_id: user.user_id, // Assuming `user` is the author_id. Adjust as necessary.
      description: instructions,
      visibility: visibility, // Assuming a fixed visibility for example. Adjust as necessary.
    };
  
    try {
      // First, submit the recipe details
      const recipeResponse = await fetch('http://localhost:8081/recipeslisays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      console.log(recipeData);
      
      if (!recipeResponse.ok) {
        throw new Error('Failed to add the recipe');
      }
  
      const recipeResult = await recipeResponse.json();
      const recipeId = recipeResult.recipeId; // Adjust according to how your API returns the new recipe ID
  
      // Now, submit ingredients for the new recipe
      const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
      ingredientsArray.forEach(async (ingredientName) => {
        const ingredientData = {
          recipe_id: recipeId,
          name: ingredientName,
          // Example quantity. Adjust as necessary or modify to include quantity in the form
        };
  
        await fetch('http://localhost:8081/ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredientData),
        });
      });
  
      alert('Recipe and ingredients added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add the recipe or ingredients. Please try again.');
    }
  }
  

  return (
    <form onSubmit={handleRecipeSubmit}>
      <div>
        <label>Title: </label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Ingredients (comma-separated): </label>
        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
      </div>
      <div>
        <label>Instructions: </label>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
      </div>
      <div>
        <label>Tags (space-separated, start with #): </label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={() => handleVisibilityChange('public')} className={visibility === 1 ? 'selected' : ''}>Public</button>
        <button type="button" onClick={() => handleVisibilityChange('private')} className={visibility === 0 ? 'selected' : ''}>Private</button>
      </div>
      {/* Image upload functionality would be integrated here */}
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;

