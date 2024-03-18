import React, { useState, useEffect } from 'react';

const EditRecipeForm = ({ user, recipe, onSave, onClose }) => {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState([recipe.ingredients]); // This should be an array of { name: '', amount: '' }
  const [description, setDescription] = useState(recipe.description);
  const [tags, setTags] = useState(recipe.keywords); // Assuming tags are an array of strings
  const [visibility, setVisibility] = useState(recipe.visibility);
  const [ingredientideet, setIngredientideet] = useState([recipe.ingredient_ids])
  const [file, setFile] = useState(null);
  const recipe_id = recipe.recipe_id

  const handleVisibilityChange = (newVisibility) => {
    setVisibility(newVisibility === 'public' ? 1 : 0);
  };
  useEffect(() => {
     const uuttaainesosaa = recipe.ingredients.split(',').map(ingredient => {
      const [name, amount] = ingredient.split(' (');
      return { name: name.trim(), amount: parseInt(amount) };
    });
    setIngredients(uuttaainesosaa);
    const uuttaainesosaidt = recipe.ingredient_ids.split(',').map(id => parseInt(id.trim()));

    setIngredientideet(uuttaainesosaidt);
  }, []);
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
      description,
      visibility,
      recipe_id
    };

    // Prepare ingredients data
    const ingredientsData = ingredients.filter(i => i.name && i.amount);

    // Prepare tags data
    const tagsData = tags.trim().split(' ');

    try {
      // Update recipe information
      const recipeResponse = await fetch('http://localhost:8081/reseptinpaivitys', {
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
      const ingredientsResponse = await Promise.all(ingredientsData.map((ingredient, index) =>
             fetch('http://localhost:8081/ingredientspaivitys', {
             method: 'PUT',
             headers: {
                  'Content-Type': 'application/json', },
             body: JSON.stringify({name: ingredient.name, quantity: ingredient.amount, ingredient_id: ingredientideet[index], recipe_id: recipe_id }),
            })
          ));

      for (const response of ingredientsResponse) {
        if (!response.ok) {
          throw new Error('Failed to update ingredients');
        }
      }

      // Update tags
      const tagsResponse = await fetch('http://localhost:8081/keywordspaivitys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: tags, recipe_id: recipe_id}),
      });

      if (!tagsResponse.ok) {
        throw new Error('Failed to update tags');
      }

      // If a new photo was provided, upload it
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipe_id', recipe_id)
        const photoResponse = await fetch('http://localhost:8081/photospaivitys', {
          method: 'PUT',
          body: formData,
        });

        if (!photoResponse.ok) {
          throw new Error('Failed to upload new photo');
        }
      }

      onSave(); // Callback function to handle post-update actions
      alert("Päivitys onnistui ;)")
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the recipe: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Muokkaa reseptiä</h2>
      <form onSubmit={handleRecipeUpdate}>
        <div>
          <label>Nimi: </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          {console.log("Ainesosat " + recipe.ingredients, "Ohjeet: " +  recipe.description, "AINESOSAIDT: " + recipe.ingredient_ids + " Photoes: " + recipe.photos,  + recipe_id +recipe.keywords)}
        </div>
        <div>
          <label>Raaka-aineet: </label>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                placeholder="Raaka-aine"
                required
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                placeholder="Määrä"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleIngredientAdd}>Lisää raaka-aine</button>
        </div>
        <div>
          <label>Ohjeet: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Hashtagit (#): </label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <button type="button" onClick={() => handleVisibilityChange('public')} className={visibility === 1 ? 'selected' : ''}>Julkinen</button>
          <button type="button" onClick={() => handleVisibilityChange('private')} className={visibility === 0 ? 'selected' : ''}>Yksityinen</button>
        </div>
        <div>
          <label>Valitse kuva: </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="button" onClick={onClose}>Peruuta</button>
        <button type="submit">Tallenna muutokset</button>
      </form>
    </div>
  );
};

export default EditRecipeForm;