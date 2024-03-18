import React from 'react';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Tab, Tabs, Modal } from 'react-bootstrap';
import  EditRecipeForm  from './EditRecipeForm';

export const PublicRecipeDisplay = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);


  useEffect(() => {
    const fetchRecipes = async () => {
        try {
            const response = await fetch(`http://localhost:8081/julkisetReseptitHaku`);
            if (!response.ok) throw new Error('Julkiset reseptit haku network error');
            const recipeData = [];

            console.log("Reseptidata komponentin tiedot pitäisi näkyä tässä", recipeData)
            setRecipes(recipeData);
        }
        catch (error) {
        console.error("Error fetching public recipe data:", error);
        }
    };
    fetchRecipes();
  }, []);
  useEffect(() => {
    console.log("Reseptien data on päivittynyt:", recipes);
  }, [recipes]);
  return (
    <div>
      JULLKKISET RESEPTTTIIIII
    </div>
  );
};

export default PublicRecipeDisplay;