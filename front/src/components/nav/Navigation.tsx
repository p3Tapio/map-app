import React from 'react';
import { Link } from 'react-router-dom';

import { Navbar, Nav } from 'react-bootstrap';

const Navigation: React.FC = () => (
  <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>App</Navbar.Brand>
      <Nav className="mr-auto ml-2">
        <Link to="/" className="navLink">
          Home
        </Link>
        <Link to="/register" className="navLink">
          Register
        </Link>
        <Link to="/login" className="navLink">
          Login
        </Link>
      </Nav>
    </Navbar>
  </>
);

export default Navigation;
