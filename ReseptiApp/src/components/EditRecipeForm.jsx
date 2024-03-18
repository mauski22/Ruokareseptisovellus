import React, { useState, useEffect } from 'react';

const EditRecipeForm = ({ user, recipe, onSave, onClose }) => {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState([recipe.ingredients]); // This should be an array of { name: '', amount: '' }
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [tags, setTags] = useState(recipe.tags); // Assuming tags are an array of strings
  const [visibility, setVisibility] = useState(recipe.visibility);
  const [file, setFile] = useState(null);

  const handleVisibilityChange = (newVisibility) => {
    setVisibility(newVisibility === 'public' ? 1 : 0);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleIngredientAdd = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleRecipeUpdate = async (event) => {
    event.preventDefault();

    // Prepare recipe data
    const recipeData = {
      title,
      author_id: user.user_id,
      instructions,
      visibility,
    };

    // Prepare ingredients data
    const ingredientsData = ingredients.filter(i => i.name && i.amount);

    // Prepare tags data
    const tagsData = tags.trim().split(' ');

    try {
      // Update recipe information
      const recipeResponse = await fetch(`PUT_ENDPOINT_FOR_RECIPE/${recipe.recipe_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!recipeResponse.ok) {
        throw new Error('Failed to update the recipe info');
      }

      // Update ingredients
      const ingredientsResponse = await Promise.all(ingredientsData.map(ingredient =>
        fetch(`PUT_ENDPOINT_FOR_INGREDIENTS/${recipe.recipe_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredient),
        })
      ));

      for (const response of ingredientsResponse) {
        if (!response.ok) {
          throw new Error('Failed to update ingredients');
        }
      }

      // Update tags
      const tagsResponse = await fetch(`PUT_ENDPOINT_FOR_TAGS/${recipe.recipe_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: tagsData }),
      });

      if (!tagsResponse.ok) {
        throw new Error('Failed to update tags');
      }

      // If a new photo was provided, upload it
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const photoResponse = await fetch(`POST_ENDPOINT_FOR_PHOTO/${recipe.recipe_id}`, {
          method: 'POST',
          body: formData,
        });

        if (!photoResponse.ok) {
          throw new Error('Failed to upload new photo');
        }
      }

      onSave(); // Callback function to handle post-update actions
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the recipe: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleRecipeUpdate}>
        <div>
          <label>Title: </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Ingredients: </label>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Ingredient Name"
                required
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Amount"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleIngredientAdd}>+ Add Ingredient</button>
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
        <div>
          <label>Select a photo: </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecipeForm;