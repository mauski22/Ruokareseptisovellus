import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const Person = () => {
  // Mock data for ideat (ideas)
  const ideat = new Array(6).fill({
    title: "Tuotekortti",
    description: "Tähän lyhyt kuvaus ideasta"
  });

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Tervetuloa Ilkka Ideoija!</h1>
        </Col>
        <Col className="text-right">
          <Button variant="primary">Lisää idea</Button>
        </Col>
      </Row>

      <Row>
        {ideat.map((idea, index) => (
          <Col md={4} className="mb-4" key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{`${idea.title} ${index + 1}`}</Card.Title>
                <Card.Text>{idea.description}</Card.Text>
                <Button variant="primary">Osta</Button>{' '}
                <Button variant="secondary">Hylkää</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="my-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Jonossa olevat ideat</Card.Title>
              <Card.Text>7 kpl</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Kuukausimaksu</Card.Title>
              <Card.Text>300€/kk</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Ostetut ideat</Card.Title>
              <Card.Text>1 kpl</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Person;
