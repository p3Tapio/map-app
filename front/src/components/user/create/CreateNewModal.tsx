import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CreateNewForm from './CreateNewForm';
import MapComponent from './MapComponent';

import { NewEntry, CreateNewModalProps } from './NewEntryTypes';

const CreateNewModal: React.FC<CreateNewModalProps> = ({
  setShow, show,
}) => {
  const handleClose = (): void => {
    setShow(false);
  };
  const onSubmit = (values: NewEntry): void => {
    // eslint-disable-next-line no-console
    console.log('values', values);
  };
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Create new entry</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MapComponent />
        <CreateNewForm onSubmit={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" type="reset" onClick={handleClose}>Reset</Button>
        <Button variant="outline-dark" type="button" onClick={handleClose}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateNewModal;
