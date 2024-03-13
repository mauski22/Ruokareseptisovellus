import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Container, Tabs, Tab } from 'react-bootstrap';

const SearchBar = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [details, setRecipedetails] = useState(null);
  // Hae avainsanat palvelimelta, kun komponentti ladataan
  useEffect(() => {
    fetch('http://localhost:8081/keywordshaku')
      .then(response => response.json())
      .then(data => setKeywords(data.map(item => item.keyword)));
  }, []);
  const handlehaku = async (event) =>  {
    event.preventDefault(); 
    try {
      const vastaus  = await fetch("http://localhost:8081/tietynreseptinhakukeywordilla",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({keyword: selectedKeyword})
      }
      )
      const reseptiID = await vastaus.json(); 
      console.log("PITÄISI TULLA RESEPTIID = ", reseptiID)

      const reseptitiedot = await fetch(`http://localhost:8081/kayttajanreseptienhaku/${reseptiID}`)
      const tiedot = await reseptitiedot.json();
      console.log(tiedot); 
      setRecipedetails(tiedot[0]); 
    }
     catch (error) {
      console.log("Reseptin haku epäonnistui: ", error)
     }
  }

  return (
    <Container className="search-bar-container">
      <InputGroup>
        <Form.Control as="select" aria-label="Etsi resepti tai raaka-aineen nimi..." onSubmit={handlehaku} onChange={e => setSelectedKeyword(e.target.value)}>
          {keywords.map((keyword, index) => (
            <option key={index} value={keyword}>
              {keyword}
            </option>
          ))}
        
        
        </Form.Control>
        <Button variant="outline-secondary" id="button-search" onClick={handlehaku}>
          Hae
        </Button>
      </InputGroup>
      {details && (
  <div className="col-md-4" style={{ padding: '10px' }}>
    <div className="card" style={{ width: '43rem', height: '40rem' }}>
      <Tabs defaultActiveKey="tabFirst" id="uncontrolled-tab-example">
        <Tab eventKey="tabFirst" title="Reseptin etusivu">
          <img src={`http://localhost:8081/images/${details.photos}`} alt={details.title} style={{ width: '50%', height: 'auto' }}/>
          <h5 className="card-title">{details.title}</h5>
          <p>Created at: {details.created_at}</p>
        </Tab>
        <Tab eventKey="tabReseptin Ainesosat" title="Reseptin Ainesosat">
          <p>Ainesosat: {details.ingredients}</p>
        </Tab>
        <Tab eventKey="tabValmistusohje" title="Valmistusohje">
          <p className="card-text">{details.description}</p>
        </Tab>
      </Tabs>
    </div>
  </div>
)}
    </Container>
  );
};

export default SearchBar;