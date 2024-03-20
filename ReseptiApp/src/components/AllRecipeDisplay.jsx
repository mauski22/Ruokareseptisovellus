import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Container, Row, Col, CardGroup, Button } from 'react-bootstrap';
import FavoriteRecipes from './FavoriteRecipes';

export const AllRecipeDisplay = () => {
  // Oletetaan, että useAuth on konteksti, joka tarjoaa kirjautuneen käyttäjän tiedot
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recipesWithRatings, setRecipesWithRatings] = useState([]);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



  const addToFavorites = (recipe) => {
    alert(`${recipe.title} has been added to favorite recipes!`);
    if (!favorites.includes(recipe)) {
      setFavorites([...favorites, recipe]);
    }
  };
  useEffect(() => {
    const fetchRecipes = async () => {
       try {
         const response = await fetch(`http://localhost:8081/allrecipes`);
         if (!response.ok) throw new Error('Julkiset reseptit haku network error');
         
         const recipeData = await response.json();
         console.log("Haettu nämä reseptit tietokannasta: , recipeData");
         setRecipes(recipeData);
       } catch (error) {
         console.error("Error fetching public recipe data:", error);
       }
    };
   
    fetchRecipes();
   }, []); // This effect runs once on component mount

   const fetchRatings = async () => {
    try {
      const response = await fetch('http://localhost:8081/getRatings');
      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }
      const ratingsData = await response.json();
      console.log('Fetched ratings:', ratingsData);

      const updatedRecipes = recipes.map(recipe => {
        const recipeRatings = ratingsData.filter(rating => rating.recipe_id === recipe.recipe_id);
        const likes = recipeRatings.filter(rating => rating.rating === 5).length;
        const dislikes = recipeRatings.filter(rating => rating.rating === 1).length;
        // Only update the recipe if likes or dislikes have changed
        if (recipe.likes !== likes || recipe.dislikes !== dislikes) {
          return { ...recipe, likes: likes || 0, dislikes: dislikes || 0 };
        }
        return recipe; // Return the original recipe if no change
      });
      console.log('Updated recipes with ratings:', updatedRecipes);
      setRecipesWithRatings(updatedRecipes); // Update the new state

    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
 };
   useEffect(() => {
  
   
    if (recipes.length > 0) { // Ensure recipes have been fetched before fetching ratings
       fetchRatings();
    }
   }, [recipes]); // This effect runs whenever the recipes state changes
   
  const submitRating = async (recipeId, userId, ratingValue) => {
    try {
       const response = await fetch('http://localhost:8081/ratingLisays', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           recipe_id: recipeId,
           user_id: userId,
           rating: ratingValue,
         }),
       });
   
       if (!response.ok) {
         throw new Error('Rating submission failed');
       }
       const responseData = await response.json();
       console.log('Rating submitted successfully: responseData');
       await delay(50);
       fetchRatings();
    } catch (error) {
       console.error('Error submitting rating:', error);
    }
   };
  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>Kaikki Reseptit</h2>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>

      {recipesWithRatings.map((recipe, index) => (
          <Card key={index} className={`recipe-card ${recipe.visibility === 1 ? '' : 'member-only'}`} style={{ width: '100vh%', height: '50%' }}>
          <Row noGutters>
            <Col md={8}>
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
               <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p>Julkaisija: {recipe.author_id}</p>
                  <p>Resepti luotu: {recipe.created_at}</p>
                  <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                  <Button onClick={() => submitRating(recipe.recipe_id, user.user_id, 5)}
                  style={{ 
                    marginRight: '10px', 
                    backgroundColor: 'white', 
                    borderColor: 'green', 
                    color: 'black' }} 
                  size="sm">
                    👍
                  </Button>
                  {recipe.likes}
                  <Button 
                    onClick={() => submitRating(recipe.recipe_id, user.user_id, 1)} 
                    style={{ 
                      marginRight: '10px', 
                      marginLeft: '20px', 
                      backgroundColor: 'white', 
                      borderColor: 'red', 
                      color: 'black' }} 
                    size="sm">
                    👎
                  </Button>
                  {recipe.dislikes}
                  <Button 
                    onClick={() => addToFavorites(recipe)} 
                    style={{ 
                      marginRight: '10px', 
                      marginLeft: '20px', 
                      backgroundColor: 'white', 
                      borderColor: 'black', 
                      color: 'black' }} 
                    size="sm">
                    ⭐
                  </Button>
               </Tab>
               <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">

                    <p>{recipe.ingredients }</p>
               </Tab>
               <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                  <p className="card-text">{recipe.description}</p>
               </Tab>
              </Tabs>
            </Col>
            <Col md={4} className="image-container">
              <img 
               variant="bottom"
               src={`http://localhost:8081/images/${recipe.photos}`}
               alt="Recipe"
               className="custom-image"
              />
            </Col>
          </Row>
        </Card>
))}
    <FavoriteRecipes favorites={favorites} />
    </div>
    </div>
  );
};



export default AllRecipeDisplay;
