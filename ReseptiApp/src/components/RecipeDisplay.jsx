import React from 'react';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';


export const RecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [authorInfo, setAuthorInfo] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/reseptienIDEIDENHAKU/${user.user_id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const recipeIds = await response.json();
        const recipeData = [];

        for (let recipe of recipeIds) {
          const recipeResponse = await fetch(`http://localhost:8081/kayttajanreseptienhaku/${recipe.recipe_id}`);
          if (!recipeResponse.ok) throw new Error('Network response was not ok');
          const recipeDetails = await recipeResponse.json();
          console.log(recipeDetails);
          recipeData.push(recipeDetails);
        }
        console.log("Reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData)
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };
    fetchRecipes();
  }, []);
  useEffect(() => {
    console.log("Reseptien data on päivittynyt:", recipes);
  }, [recipes]);
  return (
    <div className="row" style={{ display: 'flex', flexWrap: 'wrap', padding: '1rem' }}>
      {recipes.flat().map((recipe, index) => (
        <div className="col-md-4" key={index} style={{ padding: '10px' }}>
          <div className="card" style={{ width: '43rem', height: '40rem' }}>
            <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
              <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
              <img src={`http://localhost:8081/images/${recipe.photos}`} alt="Recipe" style={{ width: '50%', height: 'auto' }}/> {/* Lisätty kuva */}

                {console.log("Ainesosat: ", recipe.ingredients)}
                {console.log("reseptien kuvat: ", recipe.photos)}
                <h5 className="card-title">{recipe.title}</h5>
                <p>Author: {user.userName}</p>
                <p>Created at: {recipe.created_at}</p>
                
              </Tab>
              <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                <p>Ainesosat: {recipe.ingredients}</p>
              </Tab>
              <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                <p className="card-text">{recipe.description}</p>
              </Tab>
            </Tabs>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeDisplay;

