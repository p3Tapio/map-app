import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ListComment } from '../../state/reducers/list/listTypes';

const DeleteCommentModal: React.FC<{
  commentToEdit: ListComment | undefined;
  handleDeleteComment: (id: string) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  commentToEdit, handleDeleteComment, showDeleteModal, setShowDeleteModal,
}) => (
  <Modal show={showDeleteModal} onHide={(): void => setShowDeleteModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>
        Delete
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete the comment?
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="outline-secondary"
        type="button"
        onClick={(): void => setShowDeleteModal(false)}
      >
        Cancel
      </Button>
      <Button
        variant="outline-danger"
        type="button"
        id="confirmDelete"
        onClick={(): void => {
          if (commentToEdit) handleDeleteComment(commentToEdit._id);
        }}
      >
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteCommentModal;
