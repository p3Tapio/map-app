import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Card, Container, Col, Row,
  Form as BootstrapForm, Button,
} from 'react-bootstrap';

interface FormValues {
  username: string;
  password: string;
  passwordconfirm: string;
}

interface Props {
  onSubmit: (values: FormValues) => void;
}

const Register: React.FC = () => {
  const onSubmit = (values: FormValues): void => {
    console.log('values', values);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h4>Register</h4>
              <hr />
              <RegisterForm onSubmit={onSubmit} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  );
};

const RegisterForm: React.FC<Props> = ({ onSubmit }) => {
  const initialValues = { username: '', password: '', passwordconfirm: '' };

  const validationSchema = Yup.object({
    username: Yup.string().max(20, 'Name must be 20 characters or less').min(5, 'Name must be 5 characters or more').required('Name is required'),
    password: Yup.string().max(15, 'Password must be 15 charachters or less').min(5, 'Password must be at least 5 characters').required('Password required'),
    passwordconfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Password confirmation is required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {/* TODO type?  + pilko komponentteihin */}
      {({ errors, touched }) => (
        <Form>
          <BootstrapForm.Group>
            <BootstrapForm.Label>Username</BootstrapForm.Label>
            <br />
            <Field id="username" name="username" type="text" />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
          </BootstrapForm.Group>
          <BootstrapForm.Group>
            <BootstrapForm.Label>Password</BootstrapForm.Label>
            <br />
            <Field id="password" name="password" type="password" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
          </BootstrapForm.Group>
          <BootstrapForm.Group>
            <BootstrapForm.Label>Password confirmation:</BootstrapForm.Label>
            <br />
            <Field id="passwordconfirm" name="passwordconfirm" type="password" />
            {errors.passwordconfirm && touched.passwordconfirm ? (
              <div>{errors.passwordconfirm}</div>
            ) : null}
          </BootstrapForm.Group>
          <hr />
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
