import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Varmista, että tämä on importattu
import { useAuth } from './AuthContext';

const ImageCarousel = () => {
  const { user } = useAuth();

  // Tarkista, onko käyttäjä superadmin
  if (user && user.userRole !== 'superadmin' || !user) {
  return (
    <Carousel>
    <Carousel.Item interval={3000}>
  <img
    className="d-block w-100 carousel-image" // Lisää tämä luokka
    src="/assets/Kuva1.png"
    alt="First slide"
  />
  
</Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block carousel-image" // Lisää tämä luokka
          src="/assets/Kuva2.png"
          alt="Second slide"
        />
        
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100 carousel-image" // Lisää tämä luokka
          src="/assets/Kuva3.png"
          alt="Third slide"
        />
        
      </Carousel.Item>
      {/* Voit lisätä lisää Carousel.Item-komponentteja lisää kuvia varten */}
    </Carousel>
  );
}
};

export default ImageCarousel;
