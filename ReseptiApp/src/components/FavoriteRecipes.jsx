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

  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>Suosikki Reseptit</h2>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>
        {favoriteRecipes.map((recipe, index) => (
          <Card key={index} className="recipe-card" style={{ width: '100%', margin: '10px' }}>
            <Row noGutters>
              <Col md={8}>
                <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
                  <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p>Julkaisija: {recipe.author}</p> {/* Oletetaan että suosikkidatassa on julkaisijan tieto */}
                    <p>Resepti luotu: {recipe.created_at}</p>
                    <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                    {/* Esimerkkiä ei voi suoraan käyttää, mutta voit lisätä toiminnallisuuksia tarpeen mukaan */}
                  </Tab>
                  <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                    <p>{recipe.ingredients}</p>
                  </Tab>
                  <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                    <p className="card-text">{recipe.description}</p>
                  </Tab>
                </Tabs>
              </Col>
              <Col md={4} className="image-container">
                <img
                  src={`http://localhost:8081/images/${recipe.photos}`}
                  alt="Recipe"
                  className="custom-image"
                  style={{ width: '100%', height: 'auto' }} />
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRecipes;
