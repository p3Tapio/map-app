import React from 'react';
import {
  Form, Col, Container, Modal, Button,
} from 'react-bootstrap';
import { ListFormProps } from './listTypes';

const ListForm: React.FC<ListFormProps> = ({ handleClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let x;
  return (
    <Container>
      <Form>
        <Form.Group className="row">
          <Form.Label htmlFor="name" className="col-sm-3">Name</Form.Label>
          <Col sm={9}>
            <Form.Control
              id="name"
              name="name"
              type="text"
            />
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label htmlFor="description" className="col-sm-3">Description</Form.Label>
          <Col sm={9}>
            <Form.Control
              rows={3}
              as="textarea"
              id="description"
              name="description"
              type="text"
            />
          </Col>
        </Form.Group>
        <Modal.Footer>
          <Button variant="outline-secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button variant="outline-dark" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Container>
  );
};
export default ListForm;
