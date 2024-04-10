import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Container, Row, Col, CardGroup, Button, ListGroup } from 'react-bootstrap';

export const AllRecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [recipesWithRatings, setRecipesWithRatings] = useState([]);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [userRatings, setUserRatings] = useState({});
  const [userFavorites, setUserFavorites] = useState(new Set()); // Oletetaan, että tämä on käyttäjän suosikit
  const isRecipeInFavorites = (recipeId) => userFavorites.has(recipeId);

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const isSuperAdmin = user.userRole === "superadmin";
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        // Hae käyttäjän suosikit palvelimelta
        const response = await fetch(`http://localhost:8081/getFavoriteRecipes/${user.user_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const favoriteData = await response.json();
        const favoriteIds = new Set(favoriteData.map(recipe => recipe.recipe_id));
        setUserFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };
  
    

    fetchFavoriteRecipes();
  }, [user.user_id]);
  const toggleFavorite = async (recipe) => {
    if (isRecipeInFavorites(recipe.recipe_id)) {
      // Poista suosikeista
      await removeFromFavorites(recipe.recipe_id); // Toteuta tämä funktio
      userFavorites.delete(recipe.recipe_id);
    } else {
      // Lisää suosikkeihin
      await addToFavorites(recipe); // Oletetaan, että tämä funktio on jo määritelty
      userFavorites.add(recipe.recipe_id);
    }
    setUserFavorites(new Set([...userFavorites]));
  };

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
  const removeFromFavorites = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:8081/favoritesPoisto/${user.user_id}/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Päivitetään favoriteRecipes-tila poistamalla siitä poistettu resepti
      setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.recipe_id !== recipeId));
      alert('Resepti on poistettu suosikeista!');
    } catch (error) {
      console.error('Error removing recipe from favorites:', error);
      alert('Failed to remove recipe from favorites');
    }
  };

  const sendEmail = (recipe) => {
    const emailBody = `
      Hei,
  
      Katso tätä maukasta reseptiä: ${recipe.title}
  
      Tässä on linkki reseptiin: ${window.location.origin}/recipe/${recipe.recipe_id}
  
      Lähetetty Ruokareseptisovelluksesta.
    `;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(`Katso tätä reseptiä: ${recipe.title}`)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
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

const FavoriteStar = ({ recipe, userFavorites, toggleFavorite }) => {
  const isFavorite = userFavorites.has(recipe.recipe_id);
if(isSuperAdmin){
  return (
    <Button 
      onClick={() => toggleFavorite(recipe)}
      style={{ 
        marginRight: '10px', 
        marginLeft: '20px',
        backgroundColor: isFavorite ? 'yellow' : 'white', // Keltainen, jos suosikki; valkoinen, jos ei
        borderColor: isFavorite ? 'gold' : 'grey', // Kullanvärinen reunus, jos suosikki; harmaa, jos ei
        color: isFavorite ? 'black' : 'grey', // Tekstin väri: musta, jos suosikki; harmaa, jos ei
      }} 
      size="sm"
    >

      {isFavorite ? 'Ostettu' : '💰Osta tämä idea '} {/* Keltainen tähti, jos suosikki; harmaa tähti, jos ei */}
    </Button>
  );
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
               <Tab eventKey={`tab${index}First`} title="Idean etusivu">
                <ListGroup variant="center">
                  <ListGroup.Item>
                  <Card.Title as="h2"style={{marginTop:'30px'}}>{recipe.title}</Card.Title>
                  </ListGroup.Item>
                <ListGroup>
                  <ListGroup.Item>
                  <p>Julkaisija: {recipe.author_nickname}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <p>Idea luotu: {recipe.created_at}</p>
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
                  <FavoriteStar
        key={index}
        recipe={recipe}
        userFavorites={userFavorites}
        toggleFavorite={toggleFavorite}
      />

                  <Button variant="info" onClick={() => sendEmail(recipe)}>
                  Jaa Sähköpostilla
                    </Button>
                  </ListGroup.Item>
                  </ListGroup>
                  </ListGroup>
               </Tab>
               <Tab eventKey={`tab${index}Idean hinta & valuutta`} title="Idean hinta & valuutta">
                    <p>{recipe.ingredients }</p>
               </Tab>
               <Tab eventKey={`tab${index}Idean kuvaus`} title="Idean kuvaus">
                  <p className="card-text">{recipe.description}</p>
               </Tab>
              </Tabs>
            </Col>
            <Col md={4} className="image-container">
              <Card.Img 
               variant="right"
               src={`http://localhost:8081/images/${recipe.photos}`}
               alt="Idea"
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
