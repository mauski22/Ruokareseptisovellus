import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoriteRecipes = ({favorites}) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8081/getFavoriteRecipes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user}`, // Oletetaan Bearer-token autentikointi
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const recipes = await response.json();
        setFavoriteRecipes(recipes);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };

    fetchFavoriteRecipes();
  }, []); // Tyhjä riippuvuuslista, suoritetaan vain komponentin ensimmäisellä renderöintikerralla

  return (
    <div>
      <h2>Suosikki reseptini</h2>
      <ul>
        {favoriteRecipes.map((recipe, index) => (
          <li key={index}>
            <p>{recipe.title}</p>
            {/* Tässä voit lisätä lisää reseptin tietoja */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteRecipes;
