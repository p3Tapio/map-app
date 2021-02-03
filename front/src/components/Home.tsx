import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col, Container, Button, Jumbotron, Row,
} from 'react-bootstrap';

const Home: React.FC = () => (
  <Container className="mt-5">
    <Row className="justify-content-center">
      <Col lg={8} md={10} sm={12} xs={12}>
        <Jumbotron className="mt-5 jumboHome">
          <h2>MapApp - Work in progress...</h2>
          <hr />
          <h4>Currently implemented</h4>
          <p>Registered user can add locations to a map with name, address, description, category and image link.</p>
          <Col className="text-right mt-4">
            <Link to="/register" style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <Button variant="outline-dark" size="sm" type="button">
                Register
              </Button>
            </Link>
            <Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit', marginLeft: '5px' }}>
              <Button variant="outline-dark" size="sm" type="button">
                Login
              </Button>
            </Link>
          </Col>
        </Jumbotron>
      </Col>
    </Row>
  </Container>
);

export default Home;
