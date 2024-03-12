import React from 'react';
import { useAuth } from './AuthContext';
import { Card } from 'react-bootstrap';

const RecipeCard = ({ title, time, ingredients, instructions, tags, imageUrl }) => {
  const { user } = useAuth();

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {console.log(title)}
        <Card.Text>
          <strong>Time:</strong> {time} mins
        </Card.Text>
        <Card.Text>
          <strong>Ingredients:</strong> {ingredients} {/* Assuming ingredients is an array */}
        </Card.Text>
        <Card.Text>
          <strong>Instructions:</strong> {instructions}
        </Card.Text>
        <Card.Text>
          <strong>Tags:</strong> {tags} {/* Assuming tags is an array */}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
