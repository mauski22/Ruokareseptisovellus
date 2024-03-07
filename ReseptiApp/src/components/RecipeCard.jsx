import React from 'react';
import { Card } from 'react-bootstrap';

const RecipeCard = ({ title, time, ingredients, imageUrl }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{time} · {ingredients} ingredients</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
