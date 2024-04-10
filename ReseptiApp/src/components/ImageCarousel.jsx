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
    src="/assets/Kuva1.webp"
    alt="First slide"
  />
  <Carousel.Caption>
    <h3>Ensimmäinen kuva</h3>
    <p>Kuvaus ensimmäisestä kuvasta.</p>
  </Carousel.Caption>
</Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100 carousel-image" // Lisää tämä luokka
          src="/assets/Kuva2.webp"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Toinen kuva</h3>
          <p>Kuvaus toisesta kuvasta.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100 carousel-image" // Lisää tämä luokka
          src="/assets/Kuva3.webp"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Kolmas kuva</h3>
          <p>Kuvaus kolmannesta kuvasta.</p>
        </Carousel.Caption>
      </Carousel.Item>
      {/* Voit lisätä lisää Carousel.Item-komponentteja lisää kuvia varten */}
    </Carousel>
  );
}
};

export default ImageCarousel;
