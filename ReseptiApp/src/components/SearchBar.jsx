import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
const SearchBar = ({searchQuery}) => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [userInput, setUserInput] = useState('');
  const [details, setRecipedetails] = useState(null);
  const [searchError, setSearchError] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate(); 
  useEffect(() => {
    fetch('http://localhost:8081/julkistenreseptienkeywordsienhaku')
      .then(response => response.json())
      .then(data => setKeywords(data.map(item => item.keyword)));
  }, []);

  useEffect(() => {
    // Tyhjennä reseptitiedot kun siirrytään takaisin kotisivulle
    if (location.pathname === '/') {
      setRecipedetails(null);
    }
  }, [location]);

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
      });

      const reseptiID = await vastaus.json(); 
      console.log("PITÄISI TULLA RESEPTIID = ", reseptiID);

      if (reseptiID === "Avainsanaa ei löytynyt") {
        setSearchError(true); // Asetetaan tila ilmoittaaksemme, että hakusanalla ei löytynyt tietoa
        setRecipedetails(null); // Tyhjennetään reseptitiedot
        return;
      }

      const reseptitiedot = await fetch(`http://localhost:8081/kayttajanreseptienhaku/${reseptiID}`);
      const tiedot = await reseptitiedot.json();
      setSearchError(false);
      console.log(tiedot); 
      setRecipedetails(tiedot[0]); 
      searchQuery(false);
      navigate(`/recipe/${reseptiID}`);     
    } catch (error) {
      console.log("Reseptin haku epäonnistui: ", error);
      searchQuery(true);
    }
  }

  const handleInputChange = (event) => {
    const userInputValue = event.target.value;
    setUserInput(userInputValue); // Päivitä käyttäjän syöttämä arvo
    setSelectedKeyword(userInputValue); // Päivitä valittu avainsana
  };

  return (
    <Container className="search-bar-container">
      <InputGroup>
        <Form.Control 
          type="text"
          list="keywords"
          placeholder="Etsi resepti tai raaka-aineen nimi..."
          value={userInput}
          onChange={handleInputChange}
        />
        <datalist id="keywords">
          {keywords.map((keyword, index) => (
            <option key={index} value={keyword} />
          ))}
        </datalist>
        <Button variant="outline-secondary" id="button-search" onClick={handlehaku}>
          Hae
        </Button>
      </InputGroup>
  
      {searchError && <p style={{ color: 'red' }}>Hakusanalla ei löytynyt tietoa.</p>}
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