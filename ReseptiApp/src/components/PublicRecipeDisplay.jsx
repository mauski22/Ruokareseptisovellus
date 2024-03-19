import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Modal } from 'react-bootstrap';

export const PublicRecipeDisplay = () => {
  // Oletetaan, että useAuth on konteksti, joka tarjoaa kirjautuneen käyttäjän tiedot
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/julkisetReseptitHaku`);
        if (!response.ok) throw new Error('Julkiset reseptit haku network error');
        
        const recipeData = await response.json();
        console.log("Julkiset reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData);
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching public recipe data:", error);
      }
    };
    fetchRecipes();
  }, []);

  return (
<div className="container" style={{ maxHeight: '1200px', overflowY: 'auto' }}>
      <h2>Julkiset Reseptit</h2>
      {recipes.map((recipe, index) => (
  <Card key={index} className="recipe-card">
    <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
      <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
        <h5 className="card-title">{recipe.title}</h5>
        <p>Author: {recipe.author}</p> {/* Oletetaan että reseptissä on 'author' kenttä */}
        <p>Created at: {recipe.created_at}</p>
        <p>Visiblity: {recipe.visibility === 1 ? 'Näkyy muille' : 'Ei näy muille'}</p>
        {recipe.photos && <img src={recipe.photos} alt="Recipe" style={{ width: '50%', height: 'auto' }}/>}
      </Tab>
      <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
        <p>Ainesosat: {recipe.ingredients}</p>
      </Tab>
      <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
        <p className="card-text">{recipe.description}</p>
      </Tab>
    </Tabs>
  </Card>
))}

    </div>
  );
};

export default PublicRecipeDisplay;
