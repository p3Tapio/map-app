import React, { useState } from 'react';
import {
  Container, Card, Col, Row, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import { Location } from '../../../state/reducers/location/locationTypes';
import SingleLocationMap from './SingleLocationMap';
import altImg from '../../../style/images/bluepin.png';
import { LocationListProps } from './locationsTypes';
import DeleteModal from './DeleteModal';

const LocationList: React.FC<LocationListProps> = ({
  locations, handleDelete, setShowDelete, showDelete,
}) => {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);

  if (!locations) return null;

  return (
    <>
      <Container>
        <Row>
          <Col className="row justify-content-center locationCardGrid">
            {locations.map((x) => (
              <Card style={{ width: '18rem', margin: '2px' }} key={x._id}>
                <Card.Header>
                  {x.name}
                </Card.Header>
                <Card.Img
                  variant="top"
                  src={x.imageLink !== '-' ? x.imageLink : altImg}
                />
                <Card.Body>
                  <Card.Text>
                    {x.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer style={{ lineHeight: 1 }}>
                  <small>
                    {x.address}
                  </small>
                  <hr />
                  <Row className="justify-content-between">
                    <Col className="text-left">
                      <p className="authFormInfo">
                        Want to view it on map?
                      </p>
                      <button
                        type="button"
                        className="locationCardBtn"
                        onClick={(): void => {
                          setLocation(x);
                          setShowMap(true);
                        }}
                      >
                        Click here!
                      </button>
                    </Col>
                    <Col className="text-right" style={{ marginTop: '10px', marginRight: '-5px' }}>
                      <OverlayTrigger
                        placement="auto"
                        overlay={
                          <Tooltip id="editTooltip">Delete location</Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className="locationCardBtn"
                          onClick={(): void => {
                            setLocation(x);
                            setShowDelete(true);
                          }}
                        >
                          <Trash size={25} style={{ marginRight: '10px' }} />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="auto"
                        overlay={
                          <Tooltip id="editTooltip">Edit location details</Tooltip>
                        }
                      >
                        <button type="button" className="locationCardBtn">
                          <Pen size={22} />
                        </button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
      <SingleLocationMap location={location} show={showMap} setShow={setShowMap} />
      {location
        ? <DeleteModal id={location._id} name={location.name} showDelete={showDelete} setShowDelete={setShowDelete} handleDelete={handleDelete} />
        : null}
    </>
  );
};

export default LocationList;
