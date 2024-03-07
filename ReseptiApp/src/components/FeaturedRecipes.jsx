import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCard';

const FeaturedRecipes = ({ recipes }) => {
  return (
    <Container>
      <h2>Featured Recipes</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {recipes.map((recipe, idx) => (
          <Col key={idx}>
            <RecipeCard {...recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturedRecipes;
