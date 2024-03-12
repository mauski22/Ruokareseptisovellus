import React from 'react';
import { useAuth } from './AuthContext';
import { Card } from 'react-bootstrap';
import RecipeDisplay from './RecipeDisplay';

const RecipeCard = () => {
  return (
    <>
    <RecipeDisplay/>
    </>
  );
};

export default RecipeCard;
