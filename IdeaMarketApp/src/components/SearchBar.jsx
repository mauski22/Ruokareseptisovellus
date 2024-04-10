import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function RatingStars({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
     if (i < rating) {
       stars.push(<span key={i} style={{ fontSize: '24px', color: 'gold' }}>★</span>);
     } else {
       stars.push(<span key={i} style={{ fontSize: '24px', color: 'gold' }}>☆</span>);
     }
  }
  return <p>{stars}</p>;
 }
const SearchBar = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [userInput, setUserInput] = useState('');
  const [details, setRecipedetails] = useState(null);
  const [reseptit, setReseptit] = useState([]); 
  const [searchError, setSearchError] = useState(false);
  const {id} = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8081/julkistenreseptienkeywordsienhaku')
      .then((response) => response.json())
      .then((data) => setKeywords(data.map((item) => item.keyword)));
  }, []);
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (id) {
        // Jos osoiterivillä on id, hae yksittäisen reseptin tiedot
        try {
          const response = await fetch(`http://localhost:8081/searchbarreseptienhaku/${id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRecipedetails(data);
        } catch (error) {
          console.error('Error fetching idea details:', error);
        }
      } else {
        // Jos osoiterivillä ei ole id:tä, hae suositut reseptit
        try {
          const response = await fetch('http://localhost:8081/haetaansuositutreseptit');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setReseptit(data);
        } catch (error) {
          console.error('Error fetching popular ideas:', error);
        }
      }
    };

    fetchRecipeDetails();
 }, [id]);

  const handleShareRecipe = () => {
    const recipeUrl = window.location.href; // Tämä on nykyinen sivun URL
    const subject = encodeURIComponent(`Idea: ${details[0].title}`); // Reseptin otsikko
    const body = encodeURIComponent(`Hei! Katso tämä  komia idea: ${recipeUrl}`); // Sähköpostin viestin sisältö
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.open(mailtoLink, '_blank');
 };
  const handlehaku = async (event) => {
    event.preventDefault();
    try {
      const vastaus = await fetch('http://localhost:8081/tietynreseptinhakukeywordilla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: selectedKeyword }),
      });

      const reseptiID = await vastaus.json();
      console.log('PITÄISI TULLA IDEAID = ', reseptiID);

      if (reseptiID === 'Avainsanaa ei löytynyt') {
        setSearchError(true); // Asetetaan tila ilmoittaaksemme, että hakusanalla ei löytynyt tietoa
        setRecipedetails(null); // Tyhjennetään reseptitiedot
        return;
      }

      const reseptitiedot = await fetch(`http://localhost:8081/searchbarreseptienhaku/${reseptiID}`);
      const tiedot = await reseptitiedot.json();
      setSearchError(false);
      console.log(tiedot);
      setRecipedetails(tiedot[0]);
      navigate(`/recipe/${reseptiID}`);
    } catch (error) {
      console.log('Idea haku epäonnistui: ', error);
    }
  };

  const handleInputChange = (event) => {
    const userInputValue = event.target.value;
    setUserInput(userInputValue); // Päivitä käyttäjän syöttämä arvo
    setSelectedKeyword(userInputValue); // Päivitä valittu avainsana
  };

  return (
    <Container className="search-bar-container">
       <Form onSubmit={handlehaku}>
         <InputGroup>
           <Form.Control
             type="text"
             list="keywords"
             placeholder="Anna hakusana "
             value={userInput}
             onChange={handleInputChange}
           />
           <datalist id="keywords">
             {keywords.map((keyword, index) => (
               <option key={index} value={keyword} />
             ))}
           </datalist>
           <Button variant="outline-secondary" id="button-search" type="submit">
             Hae
           </Button>
         </InputGroup>
       </Form>
       {searchError && <p style={{ color: 'red' }}>Hakusanalla ei löytynyt tietoa.</p>}
       {!details ? (
         <>
    <div className="row" style={{ maxHeight: '95vh', overflowY: 'auto' }}> {/* Use Bootstrap row and adjust overflow */}
        {reseptit.flat().slice(0, 6).map((recipe, index) => ( // Slice the first 6 recipes to display
          <div key={index} className="col-lg-4 col-md-6 mb-4"> {/* Use Bootstrap column sizing */}
            <div className="card h-100"> {/* Full height card */}
              <Tabs defaultActiveKey={`tab${index}First`} id={`uncontrolled-tab-example-${index}`} className="flex-column h-100"> {/* Flex column for tabs */}
                    <Tab eventKey={`tab${index}First`} title="Idea">
                       <img
                         src={`http://localhost:8081/images/${recipe.photos}`}
                         alt={recipe.title}
                         style={{ width: '50%', height: 'auto' }}
                       />
                       <h5 className="card-title">{recipe.title}</h5>
                       <p>Julkaisija: {recipe.author_nickname}</p>
                       <p>Idea luotu: {recipe.created_at}</p>
                       <p>Näkyvyys: {recipe.visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                       <p>Käyttäjien antama arvosana: <RatingStars rating={recipe.average_rating} /></p>
                    </Tab>
                    <Tab eventKey={`tabReseptin Ainesosat-${index}`} title="Hinta & valuutta">
                       <p>Hinta & valuutta {recipe.ingredients}</p>
                    </Tab>
                    <Tab eventKey={`tabValmistusohje-${index}`} title="Idean kuvaus">
                       <p className="card-text">{recipe.description}</p>
                    </Tab>
                   </Tabs>
                 </div>
               </div>
             ))}
           </div>
         </>
       ) : (
         <>
           <h1>Hakemasi idea</h1>
           <div className="col-md-4" style={{ padding: '10px' }}>
             <div className="card" style={{ width: '43rem', height: '40rem' }}>
               <Tabs defaultActiveKey="tabFirst" id="uncontrolled-tab-example">
                 <Tab eventKey="tabFirst" title="Idea">
                   {details && details[0] && (
                    <>
                       <img
                         src={`http://localhost:8081/images/${details[0].photos}`}
                         alt={details[0].title}
                         style={{ width: '50%', height: 'auto' }}
                       />
                       <h5 className="card-title">{details[0].title}</h5>
                       <p>Julkaisija: {details[0].author_nickname}</p>
                       <p>Idea luotu: {details[0].created_at}</p>
                       <p>Näkyvyys: {details[0].visibility === 1 ? 'Julkinen' : 'Vain jäsenille'}</p>
                       <p>Käyttäjien antama arvosana: <RatingStars rating={details[0].average_rating} /></p>
                       <Button variant="outline-secondary" onClick={handleShareRecipe}>
                         Jaa resepti
                       </Button>
                    </>
                   )}
                 </Tab>
                 <Tab eventKey="tabReseptin Ainesosat" title="Hinta & Valuutta">
                   {details && details[0] && <p>Ainesosat: {details[0].ingredients}</p>}
                 </Tab>
                 <Tab eventKey="tabValmistusohje" title="Idean kuvaus">
                   {details && details[0] && <p className="card-text">{details[0].description}</p>}
                 </Tab>
               </Tabs>
             </div>
           </div>
         </>
       )}
    </Container>
   );
                   }
export default SearchBar;