import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';

const SearchBar = () => {
  const [keywords, setKeywords] = useState([]);

  // Hae avainsanat palvelimelta, kun komponentti ladataan
  useEffect(() => {
    fetch('http://localhost:8081/keywordshaku')
      .then(response => response.json())
      .then(data => setKeywords(data.map(item => item.keyword)));
  }, []);

  return (
    <Container className="search-bar-container">
      <InputGroup>
        <Form.Control
          as="select"
          aria-label="Etsi resepti tai raaka-aineen nimi..."
        >
          {keywords.map((keyword, index) => (
            <option key={index} value={keyword}>
              {keyword}
            </option>
          ))}
        </Form.Control>
        <Button variant="outline-secondary" id="button-search">
          Hae
        </Button>
      </InputGroup>
    </Container>
  );
};

export default SearchBar;