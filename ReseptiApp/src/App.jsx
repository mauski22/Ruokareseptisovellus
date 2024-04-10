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
import Company from './components/Company';
import Person from './components/Person';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FakeStats from './components/FakeStats';
import ImageCarousel from './components/ImageCarousel';
import Sidebar from './components/Sidebar';

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
  const FrontPageLayout = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
      
        </div>
      </div>
    );
  };

  return (
    <div className="App search-bar">
      <NavigationBar onLoginClicked={toggleLoginModal} onSignUpClicked={toggleRegisterModal} />¨
      <ImageCarousel />
      <div className="d-flex justify-content-center mt-3">
        <div className="w-50"> {/* Adjust width as needed */}
          <SearchBar />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<FrontPageLayout />} />
        <Route path="/usersTable" element={<UsersTable />} />
        <Route path="/recipes" element={<RecipeMenu />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/PasswordReset/:id/:name' element={<Changepassword />} />
        <Route path="/usersOwnRecipes" element={<RecipeDisplay />} />
        <Route path="/publicRecipes" element={<PublicRecipeDisplay />} />
        <Route path="/allRecipes" element={<AllRecipeDisplay />} />
        <Route path="/favoriteRecipes" element={<FavoriteRecipes />} />
        <Route path='/recipe/:id' element={<SearchBar/>}/>
        <Route path="/Person" element= {<Person/>}/>
        <Route path="/Company" element= {<Company/>}/>
        <Route path="/ImageCarousel" element= {<ImageCarousel/>}/>
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
    </div> 
  );
};
export default App;
