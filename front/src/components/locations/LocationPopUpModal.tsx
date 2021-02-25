import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { LocationPopUpModalProps } from './locationsTypes';
import altImg from '../../style/images/bluepin.png';

const LocationPopUpModal: React.FC<LocationPopUpModalProps> = ({ setShow, show, location }) => {
  const handleClose = (): void => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {location.name}
        </Modal.Title>
      </Modal.Header>
      <Card>
        <Card.Img
          variant="top"
          src={location.imageLink !== '-' ? location.imageLink : altImg}
        />
        <Card.Body>
          <Card.Text>
            {location.description}
          </Card.Text>
        </Card.Body>
      </Card>
      <Modal.Footer>
        <Button size="sm" variant="outline-dark" type="button" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationPopUpModal;
