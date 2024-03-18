import React from 'react';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Tab, Tabs, Modal } from 'react-bootstrap';
import  EditRecipeForm  from './EditRecipeForm';

export const RecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [authorInfo, setAuthorInfo] = useState([]);
  const [votes, setVotes] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const handleEditClick = (recipe) => {
    setCurrentRecipe(recipe);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentRecipe(null); // Optional: Clear current recipe
    // Optional: Refresh or update your recipes list here if needed
  };

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
  const handleDelete = async (recipe_id, index) => {
    try {
      const response = await fetch(`http://localhost:8081/recipes/delete/${recipe_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // Update state to remove the recipe from the UI
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      setRecipes(updatedRecipes);

      alert('Recipe has been deleted successfully!');
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
    fetchRecipes();
  }, []);
  useEffect(() => {
    console.log("Reseptien data on päivittynyt:", recipes);
  }, [recipes]);
  return (
    <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem' }}>
      {recipes.flat().map((recipe, index) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={index} style={{ marginBottom: '1rem' }}> {/* Responsive classes and margin added */}
          <Card className="recipe-card">
            <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
              <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                <h5 className="card-title">{recipe.title}</h5>
                <p>Author: {user.userName}</p>
                <p>Created at: {recipe.created_at}</p>
                <p>Visiblity: {recipe.visibility === 1 ? 'Näkyy muille' : 'Ei näy muille'}</p>
                <img src={`http://localhost:8081/images/${recipe.photos}`} alt="Recipe" style={{ width: '50%', height: 'auto' }}/> {/* Lisätty kuva */}
                <button onClick={() => handleVote(index, 'up')} style={{ marginRight: '10px' }}>
                👍
                </button>
                {votes[`${index}_up`] || 0}
                {/* Thumbs Down Button */}
                <button onClick={() => handleVote(index, 'down')} style={{ marginRight: '10px' }}>
                  👎
                </button>
                {votes[`${index}_down`] || 0}
                <button onClick={() => addToFavorites(recipe)} style={{ marginRight: '5px' }}>
                ⭐
                </button>
                <button onClick={() => handleEditClick(recipe)}>Muokkaa reseptiä</button>
                {user.user_id === recipe.author_id && (
                  <button onClick={() => handleDelete(recipe.recipe_id, index)}>
                  Poista resepti
                </button>
                )}
              </Tab>
              <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                <p>Ainesosat: {recipe.ingredients}</p>
              </Tab>
              <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                <p className="card-text">{recipe.description}</p>
              </Tab>
            </Tabs>
          </Card>
        </div>
      ))}
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
                // Optional: Refresh or update your recipes list here
              }}
              onClose={handleCloseModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RecipeDisplay;

