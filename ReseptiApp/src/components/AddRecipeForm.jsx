import React, { useState } from 'react';

const AddRecipeForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(1);

  const handleVisibilityChange = (newVisibility) => {
    setVisibility(newVisibility === 'public' ? 1 : 0);
  };

  const handleRecipeSubmit = async (event) => {
    event.preventDefault();
    const recipeData = {
      title,
      author_id: user.user_id,
      description: instructions,
      visibility,
    };

    try {
      const recipeResponse = await fetch('http://localhost:8081/recipeslisays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!recipeResponse.ok) {
        throw new Error('Failed to add the recipe');
      }

      const recipeResult = await recipeResponse.json();
      const recipeId = recipeResult.recipeId;

      const ingredientRequests = ingredients.map(ingredient => {
        if (ingredient.name && ingredient.amount) {
          return fetch('http://localhost:8081/ingredients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipe_id: recipeId,
              name: ingredient.name,
              amount: ingredient.amount,
            }),
          });
        }
        return Promise.resolve(); // Ignore empty ingredient entries.
      });

      await Promise.all(ingredientRequests);
      alert('Recipe and ingredients added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add the recipe or ingredients. Please try again.');
    }
  };

  const handleIngredientNameChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].name = value;
    setIngredients(updatedIngredients);
  };

  const handleIngredientAmountChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].amount = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  return (
    <form onSubmit={handleRecipeSubmit}>
      <div>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Ingredients: </label>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientNameChange(index, e.target.value)}
              placeholder="Ingredient Name"
              required
            />
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => handleIngredientAmountChange(index, e.target.value)}
              placeholder="Amount"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addIngredient}>+ Add Ingredient</button>
      </div>
      <div>
        <label>Instructions: </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tags (space-separated, start with #): </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={() => handleVisibilityChange('public')} className={visibility === 1 ? 'selected' : ''}>Public</button>
        <button type="button" onClick={() => handleVisibilityChange('private')} className={visibility === 0 ? 'selected' : ''}>Private</button>
      </div>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;