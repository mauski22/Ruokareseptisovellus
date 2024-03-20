import React, { useState, useEffect } from 'react';

const EditRecipeForm = ({ user, recipe, onSave, onClose }) => {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState([recipe.ingredients]); // This should be an array of { name: '', amount: '' }
  const [description, setDescription] = useState(recipe.description);
  const [tags, setTags] = useState(recipe.keywords); // Assuming tags are an array of strings
  const [visibility, setVisibility] = useState(recipe.visibility);
  const [ingredientideet, setIngredientideet] = useState([recipe.ingredient_ids])
  const [file, setFile] = useState(null);
  const [testilista, setTestilista] = useState([]); 
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

  const handledeleteingredient = async (index) => {
    if (ingredients.length === 1) {
      alert("Reseptillä on oltava vähintään yksi ainesosa.");
      return; 
    }
    // Remove the ingredient from the local state
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);

    // Get the ingredient ID to delete from the database
    const ingredientIdToDelete = await fetch('http://localhost:8081/ingredientidhaku', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({recipe_id, name: ingredients[index].name, quantity: ingredients[index].amount })
    }
    )
    const ingredient_id = await ingredientIdToDelete.json(); 
    console.log("Tässä ainesosa id", ingredient_id); 
    try {
       // Make an API call to delete the ingredient from the database
       const response = await fetch(`http://localhost:8081/ingredients/${ingredient_id}`, {
         method: 'DELETE',
       });
   
       if (!response.ok) {
         throw new Error('Failed to delete ingredient');
       }
   
       // Optionally, remove the ingredient ID from the ingredientideet state
       const updatedIngredientIds = ingredientideet.filter((_, i) => i !== index);
       setIngredientideet(updatedIngredientIds);
   
       alert('Ingredient deleted successfully');
    } catch (error) {
       console.error('Error deleting ingredient:', error);
       alert('Failed to delete ingredient');
    }
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

      const newIngredients = ingredientsData.filter((ingredient, index) => !ingredientideet[index]);

      // Create new ingredients in the database
      const newIngredientResponses = await Promise.all(newIngredients.map(ingredient =>
        fetch('http://localhost:8081/ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({recipe_id: recipe_id, name: ingredient.name, quantity: ingredient.amount }),
        })
      ));
      // Update ingredientideet with new IDs
      const newIngredientIds = await Promise.all(newIngredientResponses.map(response => response.json()));
      console.log("UUDET AINESOSA ID:T ", newIngredientIds);
      const uudetidt = [...ingredientideet, ...newIngredientIds]
      console.log("Koko lista olevinaan", uudetidt)
      setTestilista([...testilista, ...uudetidt]);
      console.log("KAIKKI AINESOSA ID:T ", testilista)
      // Update existing ingredients

      const ingredientsResponse = await Promise.all(ingredientsData.map((ingredient, index) =>
        fetch('http://localhost:8081/ingredientspaivitys', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: ingredient.name, quantity: ingredient.amount, ingredient_id: uudetidt[index], recipe_id: recipe_id }),
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
              <button type='button' onClick={() => handledeleteingredient(index)}>Poista</button>
            </div>
          ))}
          <button type="button" onClick={handleIngredientAdd}>Lisää raaka-aine</button>
        </div>
        <div>
          <label>Ohjeet: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{height: "300px", width: "700px"}}required />
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