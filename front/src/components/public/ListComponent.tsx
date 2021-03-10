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
    <div className="no-gutter-div">
      <Card className="mb-2">
        <Row className="no-gutters">
          <Col md={4}>
            <StaticMap list={list} />
          </Col>
          <Col md={8}>
            <Card.Body className="d-flex flex-column" style={{ height: '100%' }}>
              <Row className="justify-content-between">
                <Col>
                  <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                    <Card.Title>
                      {list.name}
                    </Card.Title>
                  </div>
                </Col>
                {user
                  ? (
                    <>
                      <Col className="text-right mr-2" style={{ height: '10%', marginTop: '5px' }}>
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
                                  <p style={list.favoritedBy.length > 10 ? {
                                    color: 'white', marginBottom: '-27px', marginRight: '10px', zIndex: 100, position: 'relative',
                                  } : {
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
                                  <p style={list.favoritedBy.length > 10 ? {
                                    color: 'black', marginBottom: '-27px', marginRight: '10px', zIndex: 100, position: 'relative',
                                  } : {
                                    color: 'black', marginBottom: '-27px', marginRight: '13px', zIndex: 100, position: 'relative',
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
                  : (
                    <Col className="text-right mr-2" style={{ height: '10%', marginTop: '5px' }}>
                      <OverlayTrigger
                        placement="auto"
                        overlay={(
                          <Tooltip id="editTooltip">
                            Login or register to favorite
                          </Tooltip>
                        )}
                      >
                        <button
                          type="button"
                          style={{ all: 'unset', cursor: 'pointer' }}
                        >
                          <p style={list.favoritedBy.length > 10 ? {
                            color: 'black', marginBottom: '-27px', marginRight: '10px', zIndex: 100, position: 'relative',
                          } : {
                            color: 'black', marginBottom: '-27px', marginRight: '13px', zIndex: 100, position: 'relative',
                          }}
                          >
                            {list.favoritedBy.length}
                          </p>
                          <Heart id="heartUnfill" size="35" />
                        </button>
                      </OverlayTrigger>
                    </Col>
                  )}
              </Row>
              <hr />
              <Col>
                <Card.Text>
                  {list.description}
                </Card.Text>
                <ul>
                  {' '}
                  {locations.map((x) => (
                    <li key={x._id}>{x.name}</li>
                  ))}
                  {list.locations.length > 3 ? <li>And more, click below for full list </li> : null}
                </ul>

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
                      <div style={{
                        whiteSpace: 'pre-wrap', display: 'block', lineHeight: 1, marginTop: '5px',
                      }}
                      >
                        <small>
                          Created by:
                          <br />
                          {list.createdBy.username}
                          {' '}
                          (
                          {new Date(list.date).toLocaleString('default', { year: 'numeric', month: 'short' })}
                          )
                        </small>
                      </div>
                    )}
                  </Col>
                  <Col className="text-right">
                    <Col className="d-flex flex-column" style={{ marginLeft: '35px' }}>
                      <Link to={{ pathname: `/public/${list._id}`, state: { from: fromWhere } }}>
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
                      <br />
                      <small style={{ marginTop: '-10px' }}>
                        {list.comments.length}
                        {' '}
                        comments
                      </small>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ListComponent;
