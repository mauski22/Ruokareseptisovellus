import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import UsersTable from './components/UsersTable';
import ResetPassword from './components/ResetPassword';
import Changepassword from './components/Changepasswordform';
import RecipeMenu from './components/RecipeMenu';
import RecipeDisplay from './components/RecipeDisplay';
import PublicRecipeDisplay from './components/PublicRecipeDisplay';
import AllRecipeDisplay from './components/AllRecipeDisplay';
import FavoriteRecipes from './components/FavoriteRecipes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(true);
  const location = useLocation(); 

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8081/haetaansuositutreseptit', {});

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const recipes = await response.json();
        setRecipes(recipes);
        console.log(recipes);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };
    fetchPopularRecipes();

    if (location.pathname === '/') {
      setSearchQuery(true);
    }

  }, [location]);
  return (
    <div className="App search-bar">
      <NavigationBar onLoginClicked={toggleLoginModal} onSignUpClicked={toggleRegisterModal} />
      <Routes>
        <Route path="/usersTable" element={<UsersTable />} />
        <Route path="/recipes" element={<RecipeMenu />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/PasswordReset/:id/:name' element={<Changepassword />} />
        <Route path="/usersOwnRecipes" element={<RecipeDisplay />} />
        <Route path="/publicRecipes" element={<PublicRecipeDisplay />} />
        <Route path="/allRecipes" element={<AllRecipeDisplay />} />
        <Route path="/favoriteRecipes" element={<FavoriteRecipes />} />
        <Route path='/recipe/:id'/>
        <Route path="/"/>
      </Routes>

      <Modal show={showLoginModal} onHide={toggleLoginModal}>
        <Modal.Header closeButton>
          <Modal.Title>Kirjaudu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginComponent handleCloseForm={toggleLoginModal} handleResetLinkClick={!showLoginModal} />
        </Modal.Body>
      </Modal>

      <Modal show={showRegisterModal} onHide={toggleRegisterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rekisteröidy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterComponent handleCloseForm={toggleRegisterModal} />
        </Modal.Body>
      </Modal>
      <SearchBar searchQuery={setSearchQuery}/>
     {/* <div className="container" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem' }}>
          {searchQuery && <h1>Suosittuja Reseptejä</h1>}
          {recipes.flat().map((recipe, index) => {
            if (searchQuery === true) {
            return (
              <div className="col-lg-4 col-md-6 col-sm-12" key={index} style={{ marginBottom: '1rem' }}>
                <div className="recipe-card" style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '10px' }}>
                  <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`}>
                    <Tab eventKey={`tab${index}First`} title="Reseptin etusivu">
                      <h5 className="card-title">{recipe.title}</h5> <br></br>
                      <p>Kuinka moni tykkäsi: {recipe.average_rating}</p>
                      <p>Resepti lisätty: {recipe.created_at}</p>
                      <p>Reseptin näkyvyys: {recipe.visibility === 1 ? 'Kaikille' : 'Vain jäsenet'}</p>
                      <img src={`http://localhost:8081/images/${recipe.photos}`} alt="Recipe" style={{ width: '50%', height: 'auto' }} />
                    </Tab>
                    <Tab eventKey={`tab${index}Reseptin Ainesosat`} title="Reseptin Ainesosat">
                      {recipe.ingredients}
                    </Tab>
                    <Tab eventKey={`tab${index}Valmistusohje`} title="Valmistusohje">
                      <p className="card-text">{recipe.description}</p>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            ); }
            else 
            {
              
            }
          })}
        </div>
      </div>  */}
    </div> 
  );
};
export default App;
