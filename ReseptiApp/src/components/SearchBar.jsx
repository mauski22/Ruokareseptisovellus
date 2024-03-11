import React from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';

const SearchBar = () => {
  return (
    <Container className="search-bar-container">
      <InputGroup>
        <Form.Control
          placeholder="Etsi resepti tai raaka-aineen nimi..."
          aria-label="Etsi resepti tai raaka-aineen nimi..."
        />
        <Button variant="outline-secondary" id="button-search">
          Hae
        </Button>
      </InputGroup>
    </Container>
  );
};

export default SearchBar;
