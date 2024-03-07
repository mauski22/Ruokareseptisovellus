import React from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';

const SearchBar = () => {
  return (
    <Container className="search-bar-container">
      <InputGroup>
        <Form.Control
          placeholder="Search for recipes, ingredients, or more"
          aria-label="Search for recipes, ingredients, or more"
        />
        <Button variant="outline-secondary" id="button-search">
          Let's go
        </Button>
      </InputGroup>
    </Container>
  );
};

export default SearchBar;
