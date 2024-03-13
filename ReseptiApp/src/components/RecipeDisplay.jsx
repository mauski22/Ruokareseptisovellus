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

        const resp = await fetch(`http://localhost:8081/users/${user.user_id}`);
        if(!response.ok)throw new Error('Ongelma nickName haussa(1)');
        const authorData = await resp.json();
        setAuthorInfo(authorData);

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
    <div className="container mt-3"> {/* Added container for better spacing and alignment */}
      <div className="row g-3"> {/* Added gutter for spacing between grid items */}
        {recipes.flat().map((recipe, index) => (
          <div className="col-12 col-md-4" key={index}> {/* Adjust for better responsiveness */}
            <div className="card h-100"> {/* Remove inline styles for width and height, use h-100 for equal height */}
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`} className="flex-column">
                <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                  <img src={recipe.photos} className="card-img-top" alt="Recipe" /> {/* Use Bootstrap classes for images */}
                  <div className="card-body">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p>Author: {user.userName}</p>
                    <p>Created at: {recipe.created_at}</p>
                  </div>
                </Tab>
                <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                  <div className="card-body">
                    <p>Ainesosat: {recipe.ingredients}</p>
                  </div>
                </Tab>
                <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                  <div className="card-body">
                    <p className="card-text">{recipe.description}</p>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default RecipeDisplay;

