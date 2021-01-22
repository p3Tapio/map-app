import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DeleteModalProps } from './locationsTypes';

const DeleteModal: React.FC<DeleteModalProps> = ({
  showDelete, setShowDelete, name, id, handleDelete,
}) => {
  const handleClose = (): void => {
    setShowDelete(false);
  };
  return (
    <Modal show={showDelete} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete location
        {' '}
        {name}
        ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" type="button" onClick={handleClose}>Cancel</Button>
        <Button variant="outline-danger" type="button" onClick={(): void => { handleDelete(id, name); }}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
