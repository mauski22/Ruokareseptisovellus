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
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');


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

  const handleImageSelect = (url) => {
    setSelectedImageUrl(url);
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
            }),
          });
        }
        return Promise.resolve(); // Ignore empty ingredient entries.
      });

        const photoResponse = await fetch('http://localhost:8081/photoslisays', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipe_id: reseptiIdtulos,
            url: selectedImageUrl // Tämä on valitun kuvan URL
          })
        });

        if (!photoResponse.ok) {
          throw new Error('Failed to add the photo');
        }

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
      <div>
        <label>Image Search: </label>
        <input
          type="text"
          onChange={(e) => searchImages(e.target.value)}
          placeholder="Search image on Unsplash"
        />
        <div>
          {searchResults.map((img) => (
            <img 
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description}
              onClick={() => handleImageSelect(img.urls.small)}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                cursor: 'pointer',
                border: selectedImageUrl === img.urls.small ? '3px solid blue' : 'none' // Korostus valitulle kuvalle
              }} 
            />
          ))}
        </div>
      </div>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;