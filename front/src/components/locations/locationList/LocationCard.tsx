import React from 'react';
import {
  Card, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { Trash, Pen } from 'react-bootstrap-icons';
import altImg from '../../../style/images/bluepin.png';
import { LocationCardProps } from '../locationsTypes';

const LocationCard: React.FC<LocationCardProps> = ({
  location, setLocation, setShowDelete, setShowEdit, setShowMap, type,
}) => (
  <Card style={{ width: '18rem', margin: '2px' }} key={location._id}>
    <Card.Header>
      {location.name}
    </Card.Header>
    <Card.Img
      variant="top"
      src={location.imageLink !== '-' ? location.imageLink : altImg}
    />
    <Card.Body>
      <Card.Text>
        {location.description}
      </Card.Text>
    </Card.Body>
    <Card.Footer style={{ lineHeight: 1 }}>
      <small>
        {location.address}
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
              setLocation(location);
              setShowMap(true);
            }}
          >
            Click here!
          </button>
        </Col>
        {type === 'public' ? null
          : (
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
                    setLocation(location);
                    if (setShowDelete !== undefined) setShowDelete(true);
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
                    setLocation(location);
                    if (setShowEdit !== undefined) setShowEdit(true);
                  }}
                >
                  <Pen size={22} />
                </button>
              </OverlayTrigger>
            </Col>
          )}
      </Row>
    </Card.Footer>
  </Card>
);

export default LocationCard;
