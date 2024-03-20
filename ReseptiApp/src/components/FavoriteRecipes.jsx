import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Col, Row } from 'react-bootstrap';

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/getFavoriteRecipes/${user.user_id}`, {
          method: 'GET',
          headers: {
            
          },
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
  }, [user.user_id, user.token]); // Lisätty riippuvuus käyttäjän ID:hen ja tokeniin

  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>Suosikki reseptini</h2>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>

      {favoriteRecipes.map((recipe, index) => (
  <Card key={index} className="recipe-card" style={{ width: '100vh%', height: '50%' }}>
    <Row noGutters>
      <Col md={8}>
        <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
          <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
            <h5 className="card-title">{recipe.title}</h5>
            <p>Julkaisija: {recipe.author_id}</p>
            <p>Resepti luotu: {recipe.created_at}</p>
            <p>{recipe.description}</p> {/* Oletetaan, että kuvaus on tässä kentässä */}
          </Tab>
          {/* Lisää muita välilehtiä tarpeen mukaan */}
        </Tabs>
      </Col>
      <Col md={4} className="image-container">
        <img 
          src={`http://localhost:8081/images/${recipe.photos}`}
          alt="Reseptikuva"
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

export default FavoriteRecipes;
