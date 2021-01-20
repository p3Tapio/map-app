import axios from 'axios';
import React, { FormEvent } from 'react';
import {
  Form, Col, Container, Modal, Button,
} from 'react-bootstrap';
import { CreateNewFormProps } from './NewEntryTypes';

const CreateNewForm: React.FC<CreateNewFormProps> = ({
  onSubmit, location, setLocation, address, setAddress, setPinPosition, validationMsg,
}) => {
  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const dropPin = async (): Promise<void> => {
    if (address.length >= 3) {
      const response = await axios.get(`${mapBoxUrl}/${address}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
      if (response.data.features[0]) {
        setPinPosition([response.data.features[0].geometry.coordinates[1],
          response.data.features[0].geometry.coordinates[0]]);
      }
    }
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className="row">
          <Form.Label htmlFor="name" className="col-sm-3">Name</Form.Label>
          <Col sm={9} className={validationMsg.nameErr ? 'newLocationErrorField' : 'newLocationOkField'}>
            <Form.Control
              id="name"
              name="name"
              type="text"
              onChange={(e: FormEvent): void => {
                setLocation({ ...location, name: (e.target as HTMLTextAreaElement).value });
              }}
            />
            {(validationMsg.nameErr && <p className="newLocationError">{validationMsg.nameErr}</p>)}
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label htmlFor="address" className="col-sm-3">Address</Form.Label>
          <Col sm={9} className={validationMsg.addressErr ? 'newLocationErrorField' : 'newLocationOkField'}>
            <Form.Control
              id="address"
              name="address"
              type="text"
              value={address}
              onBlur={dropPin}
              onChange={(e: FormEvent): void => {
                setAddress((e.target as HTMLTextAreaElement).value);
              }}
            />
            {(validationMsg.addressErr && <p className="newLocationError">{validationMsg.addressErr}</p>)}
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
              onChange={(e: FormEvent): void => {
                setLocation({ ...location, description: (e.target as HTMLTextAreaElement).value });
              }}
            />
            {(validationMsg.descriptionErr ? <p className="newLocationError">{validationMsg.descriptionErr}</p> : <p />)}
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label htmlFor="description" className="col-sm-3">Category</Form.Label>
          <Col sm={9} className={validationMsg.categoryErr ? 'newLocationErrorField' : 'newLocationOkField'}>
            <Form.Control
              as="select"
              className="form-control"
              id="category"
              name="category"
              onChange={(e: FormEvent): void => {
                setLocation({ ...location, category: (e.target as HTMLTextAreaElement).value });
              }}
            >
              <option value="">Select category</option>
              <option value="sights">Sights</option>
              <option value="foodDrink">Food &amp; Drink</option>
              <option value="shopping">Shopping</option>
              <option value="museumArt">Museums &amp; Art</option>
            </Form.Control>
            {(validationMsg.categoryErr && <p className="newLocationError">{validationMsg.categoryErr}</p>)}
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label htmlFor="name" className="col-sm-3">Image link</Form.Label>
          <Col sm={9}>
            <Form.Control
              id="imagelink"
              name="imagelink"
              type="text"
              onChange={(e: FormEvent): void => {
                setLocation({ ...location, imageLink: (e.target as HTMLTextAreaElement).value });
              }}
            />
          </Col>
        </Form.Group>
        <Modal.Footer>
          <Button variant="outline-secondary" type="reset">Reset</Button>
          <Button variant="outline-dark" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Container>
  );
};
export default CreateNewForm;
