import React, { FormEvent } from 'react';
import {
  Form, Col, Container, Modal, Button,
} from 'react-bootstrap';
import { ListFormProps } from '../listTypes';

const ListForm: React.FC<ListFormProps> = ({
  handleClose, handleSubmit, newList, setNewList, validationMsg,
}) => (
  <Container>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="row">
        <Form.Label htmlFor="name" className="col-sm-3">Name</Form.Label>
        <Col sm={9} className={validationMsg.nameErr ? 'newLocationErrorField' : 'newLocationOkField'}>
          <Form.Control
            id="name"
            name="name"
            type="text"
            value={newList.name}
            onChange={(e: FormEvent): void => {
              setNewList({ ...newList, name: (e.target as HTMLTextAreaElement).value });
            }}
          />
          {(validationMsg.nameErr && <p className="newLocationError">{validationMsg.nameErr}</p>)}
        </Col>
      </Form.Group>
      <Form.Group className="row">
        <Form.Label htmlFor="description" className="col-sm-3">Description</Form.Label>
        <Col sm={9} className={validationMsg.descriptionErr ? 'newLocationErrorField' : 'newLocationOkTextfield'}>
          <Form.Control
            rows={3}
            as="textarea"
            id="description"
            name="description"
            type="text"
            value={newList.description}
            onChange={(e: FormEvent): void => {
              setNewList({ ...newList, description: (e.target as HTMLTextAreaElement).value });
            }}
          />
          {(validationMsg.descriptionErr
            ? <p className="newLocationError">{validationMsg.descriptionErr}</p>
            : <p />)}
        </Col>
      </Form.Group>
      <Form.Group className="row">
        <Form.Label htmlFor="Visibility" className="col-sm-3">Visibility</Form.Label>
        <Col sm={9}>
          <Form.Check
            type="switch"
            id="visibility"
            label={newList.public ? 'Public' : 'Private'}
            value={newList.public}
            onChange={(): void => {
              setNewList({ ...newList, public: !newList.public });
            }}
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
export default ListForm;
