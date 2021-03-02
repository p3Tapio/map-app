import { Formik, Field, Form } from 'formik';
import React from 'react';
import {
  Button, Col, Container, Form as BootstrapForm, Modal, Row,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { ListComment } from '../../state/reducers/list/listTypes';
import ErrorMessage from '../user/auth/ErrorMessage';

const EditCommentModal: React.FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: { comment: string }) => void;
  commentToEdit: ListComment | undefined;
}> = ({
  showModal, setShowModal, onSubmit, commentToEdit,
}) => (
  <Modal show={showModal} onHide={(): void => setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        Edit comment
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CommentForm setShowModal={setShowModal} onSubmit={onSubmit} commentToEdit={commentToEdit} />
    </Modal.Body>
  </Modal>
);

const CommentForm: React.FC<{
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: { comment: string }) => void;
  commentToEdit: ListComment | undefined;
}> = ({ setShowModal, onSubmit, commentToEdit }) => {
  const validationSchema = Yup.object({
    comment: Yup.string()
      .min(8, 'Comment must be at least 8 characters')
      .max(250, 'Comment must be under 250 characters')
      .required('Comment is required'),
  });
  const initialValues = { comment: commentToEdit ? commentToEdit.comment : '' };
  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched }): JSX.Element => (
              <Form>
                <Col>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Comment</BootstrapForm.Label>
                    <Field
                      id="commentField"
                      className="form-control"
                      rows={4}
                      as="textarea"
                      name="comment"
                      type="text"
                    />
                    <ErrorMessage touched={touched.comment} error={errors.comment} />
                  </BootstrapForm.Group>
                </Col>
                <Col className="text-right mb-4">
                  <Button
                    variant="outline-danger"
                    id="resetComment"
                    type="reset"
                    onClick={(): void => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline-dark"
                    id="submitComment"
                    type="submit"
                    style={{ marginLeft: '5px' }}
                  >
                    Save
                  </Button>
                </Col>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCommentModal;
