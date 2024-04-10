import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

const Company = () => {
  // Mock data for ideat (ideas) and stats
  const ideat = new Array(3).fill({}).map((_, index) => ({
    title: `Tuotekortti ${index + 1}`,
    description: "Tähän lyhyt kuvaus ideasta"
  }));

  // Stats data
  const stats = {
    queue: 7,
    monthlyFee: '300€/kk',
    purchased: 1
  };

  // Component to render individual idea cards
  const IdeaCard = ({ title, description }) => (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary">Osta</Button>{' '}
        <Button variant="secondary">Hylkää</Button>
      </Card.Body>
    </Card>
  );

  return (
    <Container>
      <Row className="my-4 justify-content-between">
        <Col>
          <h1>Tervetuloa Piian Piha!</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Jonossa olevat ideat</Card.Title>
              <Card.Text>{stats.queue} kpl</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Kuukausimaksu</Card.Title>
              <Card.Text>{stats.monthlyFee}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Ostetut ideat</Card.Title>
              <Card.Text>{stats.purchased} kpl</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="mb-3">
          <h4>Katseluoikeus päättyy</h4>
          <Row>
            {ideat.map((idea, index) => (
              <Col md={4} key={index}>
                <IdeaCard title={idea.title} description={idea.description} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Uusimmat ideat kategorioissasi</h4>
          <Row>
            {ideat.map((idea, index) => (
              <Col md={4} key={index}>
                <IdeaCard title={idea.title} description={idea.description} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Company;
