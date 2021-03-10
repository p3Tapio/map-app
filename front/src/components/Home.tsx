import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Col, Jumbotron, Row,
} from 'react-bootstrap';
import {
  GeoAlt, Github, Heart, Search,
} from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../state/store';
import { getPublicLists } from '../state/reducers/list/listActions';
import { List } from '../state/reducers/list/listTypes';
import StaticMap from './public/StaticMap';

const Home: React.FC = () => (
  <div className="no-gutter-div">
    <Row className="justify-content-center">
      <Col lg md={10} sm xs={12}>
        <Jumbotron className="jumboHome mt-4">
          <Row className="mx-1">
            <Col className="text-left">
              <h2>
                MapApp
                <GeoAlt className="ml-2 spin-home-icon" />
              </h2>
            </Col>
            <Col className="text-right mt-3">
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                Register
              </Link>
              {' | '}
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit', marginLeft: '5px' }}>
                Login
              </Link>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="mx-3">
              <p>
                This is a map application that can be used for creating lists of locations.
                Lists can be set either as private or public, and used e.g. as a reminder of places you wish to see or as a guide for others.
              </p>
              <p>
                Unregistered users can browse public location lists and see locations that have been added to them.
                After registering, users can create their own lists, as well as comment and favorite lists created by others.
              </p>
              <p>
                Below you can see three most favorited location lists. All public location lists can be accessed
                {' '}
                <Link to="/public" style={{ color: 'black', textDecoration: 'underline' }}>
                  here
                </Link>
                .
              </p>
            </Col>
          </Row>
          <hr />
          <TopLists />
          <Col className="text-right mr-2">
            <small className="mr-1">
              Source code
              {' '}
              <a
                href="https://github.com/p3Tapio/fs_project"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black', textDecoration: 'underline' }}
              >
                here
                <Github className="ml-1" />
              </a>
            </small>
          </Col>
        </Jumbotron>
      </Col>

    </Row>
  </div>
);

const TopLists: React.FC = () => {
  const publicLists = useSelector((state: RootStore) => state.lists.publicLists);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch]);

  if (!publicLists) return null;
  const mostFavorited = publicLists.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length).slice(0, 3);

  return (
    <>
      {mostFavorited.map((x) => (
        <FavContentCard key={x._id} list={x} />
      ))}
    </>
  );
};
const FavContentCard: React.FC<{ list: List }> = ({ list }) => (
  <Card className="mb-2 mx-3">
    <Row className="no-gutters">
      <Col md={4}>
        <StaticMap list={list} />
      </Col>
      <Col md={8}>
        <Card.Body className="d-flex flex-column" style={{ height: '100%' }}>
          <Row className="justify-content-between">
            <Col xs={8}>
              <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                <Card.Title>
                  {list.name}
                </Card.Title>
              </div>
            </Col>
            <Col className="text-right mr-2" style={{ height: '10%', marginTop: '5px' }}>
              <button
                type="button"
                style={{ all: 'unset' }}
              >
                <p style={{
                  color: 'black', marginBottom: '-27px', marginRight: '13px', zIndex: 100,
                }}
                >
                  {list.favoritedBy.length}
                </p>
                <Heart id="heartUnfill" size="35" />
              </button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="mx-2">
              <Card.Text>
                {list.description}
              </Card.Text>
              <ul style={{ marginLeft: '-15px' }}>
                {' '}
                {list.locations.slice(0, 3).map((x) => (
                  <li key={x._id}>{x.name}</li>
                ))}
              </ul>
            </Col>
          </Row>
          <Col className="text-right">
            <Link to={{ pathname: `/public/${list._id}`, state: { from: 'home' } }}>
              <Button
                variant="outline-dark"
                size="sm"
                type="button"
                id="viewListDetails"
              >
                View
                {' '}
                <Search size="20" style={{ marginLeft: '10px' }} />
              </Button>
            </Link>
          </Col>
        </Card.Body>
      </Col>
    </Row>
  </Card>
);

export default Home;
