import React from 'react';
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import { Card, Tab, Tabs, Modal } from 'react-bootstrap';
import  EditRecipeForm  from './EditRecipeForm';

export const RecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [lastUpdatedRecipeId, setLastUpdatedRecipeId] = useState(null);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleEditClick = (recipe) => {
    setCurrentRecipe(recipe);
    setShowEditModal(true);
 };

 const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentRecipe(null);
 };

 const handleRecipeUpdated = (recipeId) => {
  setLastUpdatedRecipeId(recipeId);
  setLastUpdatedRecipeId(0);
  console.log("Tähän id ", lastUpdatedRecipeId);
 };
  const handleDelete = async (recipe_id, index) => {
    try {
      const response = await fetch(`http://localhost:8081/recipes/delete/${recipe_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      setRecipes(updatedRecipes);

      alert('Resepti poistettu onnistuneesti!');
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert('Failed to delete the recipe.');
    }
  };

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
          recipeData.push(recipeDetails);
        }
        console.log("Reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData)
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };
    const fetchUserRecipeRatings = async () => {
      try {
          const response = await fetch(`http://localhost:8081/getUserOwnRecipeRatings/${user.user_id}`);
          if (!response.ok) {
              throw new Error('Failed to fetch user recipe ratings');
          }
          const ratingsData = await response.json();
          console.log("ratingsdata :",ratingsData);
          delay(200);
          setRatings(ratingsData);
      } catch (error) {
          console.error('Error fetching user recipe ratings:', error);
      }
    }
    fetchRecipes();
    fetchUserRecipeRatings();
    setLastUpdatedRecipeId(0);
  }, [lastUpdatedRecipeId]);
return (
<div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
<div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem' }}>
    {recipes.flat().map((recipe, index) => {
                      const recipeRatings = ratings.filter(rating => rating.recipe_id === recipe.recipe_id);
                      const likes = recipeRatings.filter(rating => rating.rating === 5).length;
                      const dislikes = recipeRatings.filter(rating => rating.rating === 1).length;
        return (
          <div className="col-lg-4 col-md-6 col-sm-12" key={index} style={{ marginBottom: '1rem' }}>
          <Card className="recipe-card">
            <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
              <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                <h5 className="card-title">{recipe.title}</h5>
                <button onClick={() => handleEditClick(recipe)}>Muokkaa reseptiä</button>
                  {user.user_id === recipe.author_id && (
                <button onClick={() => handleDelete(recipe.recipe_id, index)}>
                  Poista resepti
                </button>
                )}
                <p>Kuinka moni tykkäsi: {likes}</p>
                <p>Kuinka moni ei tykännyt: {dislikes}</p>
                <p>Resepti lisätty: {recipe.created_at}</p>
                <p>Reseptisi näkyvyys: {recipe.visibility === 1 ? 'Kaikille' : 'Vain jäsenet'}</p>
                <img src={`http://localhost:8081/images/${recipe.photos}`} alt="Recipe" style={{ width: '50%', height: 'auto' }}/>
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
      );
    })}
      <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {currentRecipe && (
            <EditRecipeForm
              user={user}
              recipe={currentRecipe}
              onSave={() => {
                setShowEditModal(false);
                handleRecipeUpdated(currentRecipe.recipe_id);
              }}
              onClose={handleCloseModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

export default RecipeDisplay;