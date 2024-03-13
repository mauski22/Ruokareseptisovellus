import React, { useState } from 'react';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: 'Z8MTDQ_WIdVPpD-W_zSpEi_Fw6MlgTIf_NjqVsarWK0', // Korvaa tämä omalla avaimellasi
});

const AddRecipeForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(1);
  const [file, setFile] = useState();
 


  const handleVisibilityChange = (newVisibility) => {
    setVisibility(newVisibility === 'public' ? 1 : 0);
  };

  const searchImages = async (query) => {
    if (!query) return;

    try {
      const response = await unsplash.search.getPhotos({ query, perPage: 3 });
      setSearchResults(response.response.results);
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
    }
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
      console.log(recipeResult);

      const reseptinidnhaku = {
        title: title,
        author_id: user.user_id,
        description: instructions
      }
      const reseptiIDn = await fetch('http://localhost:8081/recipesidhaku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reseptinidnhaku)
      });
      if(!reseptiIDn.ok) {
        throw new Error("ReseptinID:n haku epäonnistui")
      }
      const reseptiIdtulos = await reseptiIDn.json();
      console.log("ReseptiIdtulos: " + reseptiIdtulos);

      const ingredientRequests = ingredients.map(ingredient => {
        if (ingredient.name && ingredient.amount) {
          return fetch('http://localhost:8081/ingredients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipe_id: reseptiIdtulos,
              name: ingredient.name,
              quantity: ingredient.amount,
            })
          });
        }
        return Promise.resolve(); // Ignore empty ingredient entries.
      });
      const keywordsResponse = await fetch ('http://localhost:8081/keywordslisays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_id: reseptiIdtulos,
          keyword: tags
        }),
      })
      const keywordvastaus = await keywordsResponse.json();
      console.log(keywordvastaus);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recipe_id', reseptiIdtulos);
      const photoResponse = await fetch('http://localhost:8081/photoslisays', {
      method: 'POST',      
      body: formData
        });
        if (!photoResponse.ok) {
          throw new Error(photoResponse);
        }
      const kuvanlisaystulos  = await photoResponse.json(); 
      console.log(kuvanlisaystulos); 
      

      console.log("Tässä kuva", file);
      await Promise.all(ingredientRequests);
      alert('Recipe, photo and ingredients added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add the recipe, photo or ingredients. Please try again.');
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
    <form onSubmit={handleRecipeSubmit} enctype="multipart/form-data">
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
      <div>
      <label>Valitse kuva: </label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
      </div>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;