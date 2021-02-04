import React, { FormEvent } from 'react';
import {
  Form, Col, Container, Modal, Button,
} from 'react-bootstrap';
import { ListFormProps } from './listTypes';

const ListForm: React.FC<ListFormProps> = ({
  handleClose, handleSubmit, list, setList, validationMsg, formType
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
            value={list.name}
            onChange={(e: FormEvent): void => {
              setList({ ...list, name: (e.target as HTMLTextAreaElement).value });
            }}
          />
          {(validationMsg.nameErr && <p className="newLocationError">{validationMsg.nameErr}</p>)}
        </Col>
      </Form.Group>
      {formType === 'edit'
        ? (
          <>
            <Form.Group className="row">
              <Form.Label htmlFor="place" className="col-sm-3">Place</Form.Label>
              <Col sm={9} className={validationMsg.placeErr ? 'newLocationErrorField' : 'newLocationOkField'}>
                <Form.Control
                  id="place"
                  name="place"
                  type="text"
                  value={list.place}
                  onChange={(e: FormEvent): void => {
                    setList({ ...list, place: (e.target as HTMLTextAreaElement).value });
                  }}
                />
                {(validationMsg.placeErr && <p className="newLocationError">{validationMsg.placeErr}</p>)}
              </Col>
            </Form.Group>
            <Form.Group className="row">
              <Form.Label htmlFor="place" className="col-sm-3">Country</Form.Label>
              <Col sm={9} className={validationMsg.countryErr ? 'newLocationErrorField' : 'newLocationOkField'}>
                <Form.Control
                  id="country"
                  name="country"
                  type="text"
                  value={list.country}
                  onChange={(e: FormEvent): void => {
                    setList({ ...list, country: (e.target as HTMLTextAreaElement).value });
                  }}
                />
                {(validationMsg.countryErr && <p className="newLocationError">{validationMsg.countryErr}</p>)}
              </Col>
            </Form.Group>
          </>
        ) : null}
      <Form.Group className="row">
        <Form.Label htmlFor="description" className="col-sm-3">Description</Form.Label>
        <Col sm={9} className={validationMsg.descriptionErr ? 'newLocationErrorField' : 'newLocationOkTextfield'}>
          <Form.Control
            rows={3}
            as="textarea"
            id="description"
            name="description"
            type="text"
            value={list.description}
            onChange={(e: FormEvent): void => {
              setList({ ...list, description: (e.target as HTMLTextAreaElement).value });
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
            checked={list.public}
            label={list.public ? 'Public' : 'Private'}
            value={list.public}
            onChange={(): void => {
              setList({ ...list, public: !list.public });
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
