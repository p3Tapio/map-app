import React from 'react';
import {
  Col, Container, Jumbotron, Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <Container className="mt-5">
    <Row className="justify-content-center">
      <Col lg={8} md={10} sm={12} xs={12}>
        <Jumbotron className="mt-5 jumboHome">
          <h4>404 - Nothing here ... :(</h4>
          <hr />
          <p>
            You can use the top menu to navigate elsewhere, or if you wish to see the public location lists, click
            {' '}
            <Link to="/public" style={{ color: 'black', fontWeight: 'bold' }}>here!</Link>
          </p>
          <p>
            In case you want to login, click
            {' '}
            <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>this,</Link>
            {' '}
            or if you wish to register, you can click
            {' '}
            <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>here!</Link>
          </p>
        </Jumbotron>
      </Col>
    </Row>
  </Container>
);

export default NotFound;
