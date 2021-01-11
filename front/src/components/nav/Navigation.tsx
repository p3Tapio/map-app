import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

interface NavProps {
  logged: boolean | undefined;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavProps> = ({ logged, setLogged }) => {
  const history = useHistory();

  const handleLogout = (): void => {
    window.localStorage.clear();
    setLogged(false);
    history.push('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>App</Navbar.Brand>
        <Nav className="mr-auto ml-2">
          <Link to="/" className="navLink">
            Home
          </Link>
          {logged
            ? (
              <>
                <Link to="/userpage" className="navLink">
                  User
                </Link>
                <button type="button" className="navLink" onClick={handleLogout} style={{ marginLeft: '-15px' }}>Logout</button>
              </>
            )
            : (
              <>
                <Link to="/register" className="navLink" style={{ marginRight: '30px' }}>
                  Register
                </Link>
                <Link to="/login" className="navLink">
                  Login
                </Link>
              </>
            )}
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
