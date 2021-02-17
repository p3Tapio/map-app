import React from 'react';
import {
  Button, Card, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { Search, Heart, HeartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { getUser } from '../../state/localStore';
import { ListComponentProps } from './publicListTypes';
import StaticMap from './StaticMap';

const ListComponent: React.FC<ListComponentProps> = ({ list, toggleFavorite, fromWhere }) => {
  const locations = list.locations.slice(0, 3).map((x) => x);
  const user = getUser();

  return (
    <>
      <Card className="mb-2">
        <Row className="no-gutters">
          <Col md={4}>
            <StaticMap list={list} />
          </Col>
          <Col md={8}>
            <Card.Body className="d-flex flex-column" style={{ height: '100%' }}>
              <Row className="justify-content-between">
                <Col>
                  <div style={{ marginLeft: '10px' }}>
                    <Card.Title>
                      {list.name}
                    </Card.Title>
                  </div>
                </Col>
                {user
                  ? (
                    <>
                      <Col className="text-right mr-2" style={{ height: '10%' }}>
                        <OverlayTrigger
                          placement="auto"
                          overlay={(
                            <Tooltip id="editTooltip">
                              {user.favorites.includes(list._id) ? 'Remove from favorites.' : 'Add to your favorites.'}
                            </Tooltip>
                          )}
                        >
                          <button
                            onClick={(): void => toggleFavorite(list._id)}
                            type="button"
                            style={{ all: 'unset', cursor: 'pointer' }}
                          >
                            {user.favorites.includes(list._id)
                              ? (
                                <>
                                  {/* jos yli 10 jne niin sijoittuminen väärin */}
                                  <p style={{
                                    color: 'white', marginBottom: '-27px', marginRight: '13px', zIndex: 100, position: 'relative',
                                  }}
                                  >
                                    {list.favoritedBy.length}
                                  </p>
                                  <HeartFill id="heartFill" size="35" style={{ backgroundColor: 'none', zIndex: 1, position: 'relative' }} />
                                </>
                              )
                              : (
                                <>
                                  <p style={{
                                    color: 'black', marginBottom: '-27px', marginRight: '13px', zIndex: 100,
                                  }}
                                  >
                                    {list.favoritedBy.length}
                                  </p>
                                  <Heart id="heartUnfill" size="35" />
                                </>
                              )}
                          </button>
                        </OverlayTrigger>
                      </Col>
                    </>
                  )
                  : null}
              </Row>
              <Col className="mb-2">
                <Card.Text>
                  {list.description}
                </Card.Text>
                {locations.map((x) => (
                  <li key={x._id}>{x.name}</li>
                ))}
                {list.locations.length > 3 ? <li>And more, click below for full list ...</li> : null}
              </Col>
              <hr />
              <div style={{
                height: '100%', display: 'flex', alignItems: 'flex-end', marginLeft: '10px', marginTop: '-30px',
              }}
              >
                <Row className="justify-content-between mt-4" style={{ width: '100%', marginRight: 0 }}>
                  <Col className="text-left">
                    <Card.Text style={{ marginBottom: '0px' }}>
                      {(list.country !== 'unknown' && list.place !== 'unknown' && `${list.place}, ${list.country}`)}
                      {(list.country !== 'unknown' && list.place === 'unknown' && `${list.country}`)}
                      {(list.country === 'unknown' && list.place !== 'unknown' && `${list.place}`)}
                    </Card.Text>
                    {list.createdBy && (
                      <small>
                        Created by:
                        {list.createdBy.username}
                      </small>
                    )}
                  </Col>
                  <Col className="text-right">
                    <Link to={{ pathname: `/public/${list._id}`, state: { from: fromWhere } }}>
                      <Button
                        style={{ marginBottom: '-30px', marginRight: '-20px', padding: '8px' }}
                        variant="outline-dark"
                        size="sm"
                        type="button"
                      >
                        View
                        {' '}
                        <Search size="20" style={{ marginLeft: '10px' }} />
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ListComponent;
