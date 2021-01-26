import React, { useState } from 'react';
import {
  Container, Card, Col, Row, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import SingleLocationMap from './SingleLocationMap';
import altImg from '../../../../style/images/bluepin.png';
import { LocationListProps } from '../locationsTypes';
import DeleteModal from './DeleteModal';
import EditModal from '../EditModal';

const LocationList: React.FC<LocationListProps> = ({
  locations, handleDelete, address, setAddress, pinPosition, setPinPosition, validationMsg, setValidationMsg, location, setLocation,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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
                          id="delete"
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
                        <button
                          type="button"
                          id="edit"
                          className="locationCardBtn"
                          onClick={(): void => {
                            setLocation(x);
                            setPinPosition([x.coordinates.lat, x.coordinates.lng]);
                            setAddress(x.address);
                            setShowEdit(true);
                          }}
                        >
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
        ? (
          <>
            <DeleteModal
              id={location._id}
              name={location.name}
              show={showDelete}
              setShow={setShowDelete}
              handleDelete={handleDelete}
            />
            <EditModal
              show={showEdit}
              setShow={setShowEdit}
              location={location}
              setLocation={setLocation}
              address={address}
              setAddress={setAddress}
              pinPosition={pinPosition}
              setPinPosition={setPinPosition}
              validationMsg={validationMsg}
              setValidationMsg={setValidationMsg}
            />
          </>
        )
        : null}
    </>
  );
};

export default LocationList;
