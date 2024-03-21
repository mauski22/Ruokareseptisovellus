import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Container, Row, Col, CardGroup, Button, ListGroup } from 'react-bootstrap';

export const AllRecipeDisplay = () => {
  // Oletetaan, että useAuth on konteksti, joka tarjoaa kirjautuneen käyttäjän tiedot
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recipesWithRatings, setRecipesWithRatings] = useState([]);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [userRatings, setUserRatings] = useState({});




  const addToFavorites = async (recipe) => {
    try {
      const response = await fetch('http://localhost:8081/favoritesLisays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id, // Varmista, että tämä vastaa backendin odottamaa muotoa
          recipe_id: recipe.recipe_id, // Samoin tämän
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add recipe to favorites');
      }
  
      alert(`${recipe.title} on lisätty suosikkeihin!`);
    } catch (error) {
      console.error('Error adding recipe to favorites:', error);
      alert('Failed to add recipe to favorites');
    }
  };
  
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
          const response = await fetch(`http://localhost:8081/allRecipesWithAuthors`);
          if (!response.ok) throw new Error('Failed to fetch recipes with authors');
          const recipeData = await response.json();
          console.log("Fetched recipes with authors:", recipeData);
          setRecipes(recipeData);
      } catch (error) {
          console.error("Error fetching recipes with authors:", error);
      }
    };
    fetchRecipes();
   }, []);

   const fetchRatings = async () => {
    try {
      const response = await fetch('http://localhost:8081/getRatings');
      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }
      const ratingsData = await response.json();
      //console.log('Fetched ratings:', ratingsData);

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
useEffect(() => {
  const fetchUserRatings = async () => {
     try {
       const response = await fetch(`http://localhost:8081/getUserRatings/${user.user_id}`);
       if (!response.ok) {
         throw new Error('Failed to fetch user ratings');
       }
       const ratingsData = await response.json();
       const userRatingsMap = {};
       ratingsData.forEach(rating => {
         userRatingsMap[rating.recipe_id] = rating.rating;
       });
       setUserRatings(userRatingsMap);
     } catch (error) {
       console.error('Error fetching user ratings:', error);
     }
  };
 
  if (user) {
     fetchUserRatings();
  }
 }, [user]); // This effect runs whenever the user state changes
  const submitRating = async (recipeId, userId, ratingValue) => {
 if (userRatings[recipeId] !== undefined) {
  if (userRatings[recipeId] === ratingValue) {
      removeRating(recipeId, userId);
  } else {
      updateRating(recipeId, userId, ratingValue);
  }
  return;
}
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
         throw new Error('Käyttäjä on jo arvostellut tämän reseptin');
       }
       const responseData = await response.json();
       console.log('Rating submitted successfully:', responseData);
       await delay(50);
       fetchRatings();
    } catch (error) {
       console.error('Error submitting rating:', error);
    }
    setUserRatings(prevState => ({
      ...prevState,
      [recipeId]: ratingValue
   }));
   };
   const updateRating = async (recipeId, userId, newRatingValue) => {
    try {
       const response = await fetch(`http://localhost:8081/updateRating`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           recipe_id: recipeId,
           user_id: userId,
           rating: newRatingValue,
         }),
       });
   
       if (!response.ok) {
         throw new Error('Rating update failed');
       }
       setUserRatings(prevState => ({
         ...prevState,
         [recipeId]: newRatingValue
       }));
   
       fetchRatings();
    } catch (error) {
       console.error('Error updating rating:', error);
    }
   };
const removeRating = async (recipeId, userId) => {
  try {
     const response = await fetch(`http://localhost:8081/removeRating`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         recipe_id: recipeId,
         user_id: userId,
       }),
     });
 
     if (!response.ok) {
       throw new Error('Rating removal failed');
     }
     // Update the userRatings state to reflect the removal
     setUserRatings(prevState => {
       const newState = { ...prevState };
       delete newState[recipeId];
       return newState;
     });
     fetchRatings();

  } catch (error) {
     console.error('Error removing rating:', error);
  }
 };
  return (
    <div className="container" style={{ maxHeight: '95vh', overflowY: 'scroll'}}>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px'}}>

      {recipesWithRatings.map((recipe, index) => (
          <Card key={index} className={`recipe-card ${recipe.visibility === 1 ? 'public' : 'member-only'}`} style={{ width: '100vh%', height: '50%'}}>
          <Row>
            <Col md={5} style={{ marginBottom: '20px'}}>
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
               <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                <ListGroup variant="center">
                  <ListGroup.Item>
                  <Card.Title as="h2"style={{marginTop:'30px'}}>{recipe.title}</Card.Title>
                  </ListGroup.Item>
                <ListGroup>
                  <ListGroup.Item>
                  <p>Julkaisija: {recipe.author_nickname}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <p>Resepti luotu: {recipe.created_at}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <Button onClick={() => submitRating(recipe.recipe_id, user.user_id, 5)}
                  style={{ 
                    marginRight: '10px', 
                    backgroundColor: userRatings[recipe.recipe_id] === 5 ? 'lightgreen' : 'white',
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
                      backgroundColor: userRatings[recipe.recipe_id] === 1 ? 'lightcoral' : 'white',
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
                  </ListGroup.Item>
                </ListGroup>
                </ListGroup>

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
              <Card.Img 
               variant="right"
               src={`http://localhost:8081/images/${recipe.photos}`}
               alt="Recipe"
               className="custom-image"
              />
            </Col>
          </Row>
        </Card>
))}
    </div>
    </div>
  );
};



export default AllRecipeDisplay;
