import React, { useState } from 'react';


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



  const handleRecipeSubmit = async (event) => {
    event.preventDefault();
    const recipeData = {
      title,
      author_id: user.user_id,
      description: instructions,
      visibility,
    };
    // Check if the file is an image based on its extension
 const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
 const fileExtension = file.name.split('.').pop().toLowerCase();

 if (file && !allowedExtensions.includes(fileExtension)) {
    alert('Please upload an image file with a valid extension (jpg, jpeg, png, gif, bmp, webp).');
    return; // Exit the function if the file is not an image
 }
  
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
              name: ingredient.amount,
              quantity: ingredient.name,
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
      alert('Idea added succesfully');
    } catch (err) {
      console.error(err);
      alert('Failed to add the IDEA!');
    }
  };

  const handleIngredientNameChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].name = value;
    setIngredients(updatedIngredients);
  };

  const handleIngredientAmountChange = (index, value) => {
    // Regular expression to check if the value contains only digits
    const numberRegex = /^\d+$/;
   
    // Check if the value is a number
    if (numberRegex.test(value)) {
       const updatedIngredients = [...ingredients];
       updatedIngredients[index].amount = value;
       setIngredients(updatedIngredients);
    } else {
       // Optionally, show an error message to the user
       alert('Laita summa numeroina');
    }
   };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  return (
    <form onSubmit={handleRecipeSubmit} enctype="multipart/form-data" style={{flex: "auto"}}>
      <div>
        <label>Idean nimi: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hinta & valuutta: </label>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => handleIngredientAmountChange(index, e.target.value)}
              placeholder="Summa"
              required
            />
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientNameChange(index, e.target.value)}
              placeholder="Valuutta"
              required
            />
          </div>
        ))}
      </div>
      <div>
        <label>Idean kuvaus: </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)} style={{height: "400px", width: "100%"}}
          required
        />
      </div>
      <div>
        <label>Avainsanat: </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={() => handleVisibilityChange('public')} className={visibility === 1 ? 'selected' : ''}>Julkinen</button>
        <button type="button" onClick={() => handleVisibilityChange('private')} className={visibility === 0 ? 'selected' : ''}>Yksityinen</button>
      </div>
      <div>
      <label>Valitse kuva: </label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
      </div>
      <button type="submit">Lisää Idea</button>
    </form>
  );
};

export default AddRecipeForm;