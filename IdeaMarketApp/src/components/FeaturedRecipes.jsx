import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeDisplay from './RecipeDisplay';

const FeaturedRecipes = ({ recipes }) => {
  return (
    <Container>
      <h2>Ruokatrendit</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {recipes.map((recipe, idx) => (
          <Col key={idx}>
            <RecipeDisplay {...recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturedRecipes;
