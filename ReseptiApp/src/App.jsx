import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Register } from './Register'
import './App.css'
export function App() {
  const [count, setCount] = useState(0);
  const [ansassa, setAnsassa] = useState(false);
  const [imageSource, setImageSource] = useState("https://www.modernhoney.com/wp-content/uploads/2023/11/Nutella-Cream-Pie-1-crop-768x602.jpg")
  const [openApp, setOpenApp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // Default to login tab
  //
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const toggleModal = () => {
    setShowModal(!showModal);
    setActiveTab(null);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const vastaus = await fetch("http://localhost:8081/login",  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      }
      )

      const tulos = await vastaus.json();
      if (tulos === "Login Successfully") {
        console.log("LOGIN ONNISTUI", tulos);
      } else {
        console.log("LOGIN FAILED", tulos);
      }
    }
    catch (error) {
      console.log("Jokin meni pieleen login hommelissa")
      console.log("ERROR LOGIN ", error);
    }
  };
    // Send the POST request to the backend
  const handleCLICKME = () =>{
    setOpenApp(true);
  };
  if (count === 1) {
    setCount(1.1);
    setImageSource("https://d2vsf1hynzxim7.cloudfront.net/production/media/17882/responsive-images/foodnetwork-image-3553741b-911d-4d99-bfd2-df31a0e1cc1e___default_572_429.png") 
  }
  if(count ===2.1){
    setCount(2.2)
    setAnsassa(true);
    setImageSource("https://metro.co.uk/wp-content/uploads/2017/08/pri_50131368.jpg?quality=90&strip=all&zoom=1&resize=644%2C483")
  }
  if(count===3.2){
    setAnsassa(false);
    setCount(0)
    setImageSource("https://www.modernhoney.com/wp-content/uploads/2023/11/Nutella-Cream-Pie-1-crop-768x602.jpg");
  }
  return (
    <div>
    <>
      {openApp ? ( /* Conditionally render based on openApp state */
        <div>
                <div className="App">
      {!showModal && (<button onClick={toggleModal}>Klikkaa tästä!</button>)}
      {!showModal && (<div>Vinkki: Jotkut reseptit näkyvät vain rekisteröityneille käyttäjille.</div>)}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              
            </div>
            <div className="nav nav-tabs">
              <div className={activeTab === 'login' ? 'active' : ''}>
                <button onClick={() => switchTab('login')}>Kirjautumaan..</button>
              </div>
              Tai
              <div className={activeTab === 'register' ? 'active' : ''}>
                <button onClick={() => switchTab('register')}>Luo uusi käyttäjä</button>
              </div>
            </div>
            <div className="modal-body">
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  {/* Login form fields */}
                  <input value={emailInput} onChange={e => setEmailInput(e.target.value)}  type="email" placeholder="Sähköpostiosoite" />
                  <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)}  type="password" placeholder="Salasana" />
                  <button type="submit">Kirjaudu</button>
                </form>
              )}
              {activeTab === 'register' && (
                <Register/>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={toggleModal}>Peruuta</button>
            </div>
          </div>
        </div>
      )}
    </div>
          <div id="recipe-search">
            {/*hakupalkki */}
            <input type="text" id="recipe-search-input" placeholder="Search recipes..." />
            <button id="search-button">Search</button>
          </div>
  
          <table className='table'>
            <tbody>
              <tr>
                <td className="recipeCell">
                  {/* Large picture 1 */}
                  <img className="recipeImage" src="https://d2vsf1hynzxim7.cloudfront.net/production/media/17882/responsive-images/foodnetwork-image-3553741b-911d-4d99-bfd2-df31a0e1cc1e___default_572_429.png" alt="Recipe 1" />
                  <h2>Reseptttiii</h2>
                </td>
                <td className="recipeCell">
                  {/* Large picture 2 */}
                  <img className="recipeImage" src="https://www.modernhoney.com/wp-content/uploads/2023/11/Nutella-Cream-Pie-1-crop-768x602.jpg" alt="Recipe 2" />
                  <h2>Reseptttiii2</h2>
                </td>
                <td className="recipeCell">
                  {/* Large picture 3 */}
                  <img className="recipeImage" src="https://metro.co.uk/wp-content/uploads/2017/08/pri_50131368.jpg?quality=90&strip=all&zoom=1&resize=644%2C483" alt="Recipe 3" />
                  <h2>Reseptttiii 3</h2>
                </td>
              </tr>
            </tbody>
          </table>
  
        {/* Add more content as needed */}
      </div>
      ) : (
        <>
          <h1>Tervetuloa Haute Cuisine Reseptit -sivulle!</h1>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Ruokareseptisovellus</h1>
          <h2>Aleksi Hyvärinen, Toni Kuura, Mauno Rytkönen, Juho Rissanen</h2>
          <button onClick={handleCLICKME}>Click me</button>
        </>
      )}
    </>
    </div>
  );
}

export default App

