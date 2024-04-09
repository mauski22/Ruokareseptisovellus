import React, { useState, useEffect } from 'react';
import { Card, Tab, Tabs, Modal, Col, Row, Button } from 'react-bootstrap';

export const PublicRecipeDisplay = () => {
  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState([]);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8081/publicRecipesWithAuthors`);
        if (!response.ok) throw new Error('Julkiset reseptit haku network error');
        
        const recipeData = await response.json();
        console.log("Julkiset reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData);
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching public recipe data:", error);
      }

    };
    const fetchPublicRatings = async () => {
      try {
          const response = await fetch('http://localhost:8081/getPublicRatings');
          if (!response.ok) {
              throw new Error('Failed to fetch public ratings');
          }
          const ratingsData = await response.json();
          console.log("Public ratingdata got: ",ratingsData)
          setRatings(ratingsData);
      } catch (error) {
          console.error('Error fetching public ratings:', error);
      }
  };
    fetchRecipes();
    fetchPublicRatings();

  }, []);
  const registerAlert = () => {
    return(alert("Kirjauduppas sissää siitä"))
  }
  return (
    <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>Kaikki Reseptit</h2>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1px' }}>

      {recipes.map((recipe, index) => {
        const recipeRatings = ratings.filter(rating => rating.recipe_id === recipe.recipe_id);
        const likes = recipeRatings.filter(rating => rating.rating === 5).length;
        const dislikes = recipeRatings.filter(rating => rating.rating === 1).length;

        return (
          <Card key={index} className={`recipe-card ${recipe.visibility === 1 ? '' : 'member-only'}`} style={{ width: '100vh%', height: '50%' }}>
          <Row noGutters>
            <Col md={8}>
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
               <Tab eventKey={`tab${index}First`} title="Idea">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p>Julkaisija: {recipe.author_nickname}</p>
                  <p>Idea luotu: {recipe.created_at}</p>
                  <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                  <Button onClick={() => registerAlert()}
                  style={{ 
                    marginRight: '10px', 
                    backgroundColor: 'white', 
                    borderColor: 'green', 
                    color: 'black' }} 
                  size="sm">
                    👍
                  </Button>
                  {likes}
                  <Button 
                    onClick={() => registerAlert()} 
                    style={{ 
                      marginRight: '10px', 
                      marginLeft: '20px', 
                      backgroundColor: 'white', 
                      borderColor: 'red', 
                      color: 'black' }} 
                    size="sm">
                    👎
                  </Button>
                  {dislikes}
                  <Button 
                    onClick={() => registerAlert()} 
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
               <Tab eventKey={`tab${index}Idean summa ja valuutta`} title="Idean summa ja valuutta">
                    <p>{recipe.ingredients}</p>
               </Tab>
               <Tab eventKey={`tab${index}Kuvaus`} title="Idean kuvaus">
                  <p className="card-text">{recipe.description}</p>
               </Tab>
              </Tabs>
            </Col>
            <Col md={4} className="image-container">
              <img 
               variant="bottom"
               src={`http://localhost:8081/images/${recipe.photos}`}
               alt="Idea"
               className="custom-image"
              />
            </Col>
          </Row>
        </Card>
        );
      })}
    </div>
    </div>
  );
};

export default PublicRecipeDisplay;
