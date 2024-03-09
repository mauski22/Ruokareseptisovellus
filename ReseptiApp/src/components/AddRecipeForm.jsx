import React, { useState } from 'react';

const AddRecipeForm = ({ user, onSave }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecipe = {
      user, // Assuming user is the username or user ID
      title,
      ingredients: ingredients.split(','), // Splitting string into an array of ingredients
      instructions,
      tags: tags.split(' ').filter(tag => tag.startsWith('#')), // Splitting and filtering for tags
      // images would be handled here
    };
    onSave(newRecipe); // Placeholder for saving the recipe (e.g., updating state, making an API call)
    // Reset form fields
    setTitle('');
    setIngredients('');
    setInstructions('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Ingredients (comma-separated)</label>
        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
      </div>
      <div>
        <label>Instructions</label>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
      </div>
      <div>
        <label>Tags (space-separated, start with #)</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      {/* Image upload goes here */}
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;
