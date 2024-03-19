import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Tab, Tabs, Container, Row, Col, CardGroup, Button } from 'react-bootstrap';

export const AllRecipeDisplay = () => {
  // Oletetaan, että useAuth on konteksti, joka tarjoaa kirjautuneen käyttäjän tiedot
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [votes, setVotes] = useState({});
  const [favorites, setFavorites] = useState([]);


  const handleVote = (index, type) => {
    const newVotes = { ...votes };
    const voteKey = `${index}_${type}`; // Unique key for each recipe and vote type
    newVotes[voteKey] = (newVotes[voteKey] || 0) + 1;
    setVotes(newVotes);
  };
  const addToFavorites = (recipe) => {
    alert(`${recipe.title} has been added to favorite recipes!`);
    // Here you can also update the state if you want to track favorites within the app
    // For example, to prevent adding the same recipe multiple times, check if it's already a favorite
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
        console.log("Julkiset reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData);
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching public recipe data:", error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>Kaikki Reseptit</h2>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>

      {recipes.map((recipe, index) => (
          <Card key={index} className={`recipe-card ${recipe.visibility === 1 ? '' : 'member-only'}`} style={{ width: '100vh%', height: '50%' }}>
          <Row noGutters>
            <Col md={8}>
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
               <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p>Julkaisija: {recipe.author_id}</p>
                  <p>Resepti luotu: {recipe.created_at}</p>
                  <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                  <Button onClick={() => handleVote(index, 'up')} 
                  style={{ 
                    marginRight: '10px', 
                    backgroundColor: 'white', 
                    borderColor: 'green', 
                    color: 'black' }} 
                  size="sm">
                    👍
                  </Button>
                  <>{votes[`${index}_up`] || 0}</>
                  <Button 
                    onClick={() => handleVote(index, 'down')} 
                    style={{ 
                      marginRight: '10px', 
                      marginLeft: '20px', 
                      backgroundColor: 'white', 
                      borderColor: 'red', 
                      color: 'black' }} 
                    size="sm">
                    👎
                  </Button>
                  {votes[`${index}_down`] || 0}
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
                  {/**<ul>
                    {recipe.ingredients.split(',').map((ingredient, index) => (
                      <li key={index}>{ingredient.trim()}</li>
                    ))}
                  </ul> */}
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
    </div>
    </div>
  );
};

export default AllRecipeDisplay;
