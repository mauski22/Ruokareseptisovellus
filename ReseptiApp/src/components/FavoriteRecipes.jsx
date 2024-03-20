import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tabs, Tab } from 'react-bootstrap'; // Assuming you're using react-bootstrap

const FavoriteRecipes = ({favorites}) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/getFavoriteRecipes/${user.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user}`,
            'Content-Type': 'application/json',
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
  }, []);

  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem' }}>
        {favoriteRecipes.map((recipe, index) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={index} style={{ marginBottom: '1rem' }}>
            <Card className="recipe-card">
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
                <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p>Author: {user.userName}</p>
                  <p>Created at: {recipe.created_at}</p>
                  <p>Visiblity: {recipe.visibility === 1 ? 'Näkyy muille' : 'Ei näy muille'}</p>
                  <img src={`http://localhost:8081/images/${recipe.photos}`} alt="Recipe" style={{ width: '50%', height: 'auto' }}/>
                  {/* You can add more functionalities here */}
                </Tab>
                <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                   {recipe.ingredients}
                </Tab>
                <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                  <p className="card-text">{recipe.description}</p>
                </Tab>
              </Tabs>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRecipes;
