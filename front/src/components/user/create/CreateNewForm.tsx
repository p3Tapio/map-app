import React from 'react';
import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
import {
  Form as BootstrapForm, Col, Container,
} from 'react-bootstrap';
import { CreateNewFormProps } from './NewEntryTypes';

const CreateNewForm: React.FC<CreateNewFormProps> = ({ onSubmit }) => {
  const initialValues = {
    name: '', description: '', category: '', address: '', coordinates: '', imageLink: '',
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        <Form>
          <BootstrapForm.Group className="row">
            <BootstrapForm.Label htmlFor="name" className="col-sm-3">Name</BootstrapForm.Label>
            <Col sm={9}>
              <Field className="form-control" id="name" name="name" type="text" />
            </Col>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="row">
            <BootstrapForm.Label htmlFor="address" className="col-sm-3">Address</BootstrapForm.Label>
            <Col sm={9}>
              <Field className="form-control" id="address" name="address" type="text" />
            </Col>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="row">
            <BootstrapForm.Label htmlFor="description" className="col-sm-3">Description</BootstrapForm.Label>
            <Col sm={9}>
              <Field as="textarea" rows={3} className="form-control" id="description" name="description" type="text" />
            </Col>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="row">
            <BootstrapForm.Label htmlFor="description" className="col-sm-3">Category</BootstrapForm.Label>
            <Col sm={9}>
              <Field as="select" className="form-control" id="category" name="category">
                <option value="">Select category</option>
                <option value="a">Aaaa</option>
                <option value="b">Beee</option>
                <option value="c">Cee</option>
              </Field>
            </Col>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="row">
            <BootstrapForm.Label htmlFor="name" className="col-sm-3">Image link</BootstrapForm.Label>
            <Col sm={9}>
              <Field className="form-control" id="imagelink" name="imagelink" type="text" />
            </Col>
          </BootstrapForm.Group>
        </Form>
      </Formik>
    </Container>

  );
};
export default CreateNewForm;
