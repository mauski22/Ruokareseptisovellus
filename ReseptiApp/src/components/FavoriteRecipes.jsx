import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Button, Row, Col } from 'react-bootstrap';


const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/getFavoriteRecipes/${user.user_id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const recipes = await response.json();
        setFavoriteRecipes(recipes);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };
    

    fetchFavoriteRecipes();
  }, [user.user_id]);
  
  {/*} Tässä voit lisätä toiminnallisuuden suosikkien poistamiseen
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
      alert('Recipe has been removed from favorites!');
    } catch (error) {
      console.error('Error removing recipe from favorites:', error);
      alert('Failed to remove recipe from favorites');
    }
  };
  */}


  return (
<div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
  <h2>Myydyt ideat</h2>
  <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>
    {favoriteRecipes.map((recipe, index) => (
      <Card key={index} className="recipe-card" style={{ width: '100%', margin: '10px' }}>
        <Row noGutters>
          <Col md={8}>
            <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
              <Tab eventKey={`tab${index}First`} title="Idean etusivu">
                <img
                  src={`http://localhost:8081/images/${recipe.photos}`}
                  alt="Idea"
                  className="custom-image"
                  style={{ width: '50%', height: 'auto' }} />
                <h5 className="card-title">{recipe.title}</h5>
                <p>Julkaisija: {recipe.author_nickname}</p>
                <p>Idea luotu: {recipe.created_at}</p>
                <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
              </Tab>
              <Tab eventKey={`tab${index}Hinta & valuutta`} title="Hinta & valuutta">
                <p>{recipe.ingredients}</p>
              </Tab>
              <Tab eventKey={`tab${index}Kuvaus`} title="Kuvaus">
                <p className="card-text">{recipe.description}</p>
              </Tab>
            </Tabs>
          </Col>
          {/* Ota pois Col-md={4} osio, jossa alkuperäinen kuva sijaitsi */}
        </Row>
      </Card>
    ))}
  </div>
</div>

  );
};

export default FavoriteRecipes;
