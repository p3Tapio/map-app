import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ListComment } from '../../../state/reducers/list/listTypes';

const DeleteCommentModal: React.FC<{
  commentToEdit: ListComment | undefined;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
  handleDeleteComment: (id: string) => void;
}> = ({ commentToEdit, setCommentToEdit, handleDeleteComment }) => (
  <Modal show={!!commentToEdit}>
    <Modal.Header closeButton>
      <Modal.Title>
        Delete
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete your comment?
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="outline-secondary"
        type="button"
        onClick={(): void => setCommentToEdit(undefined)}
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
