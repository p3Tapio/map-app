import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Form as BootstrapForm, Button, Col, Card, Container, Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { UserAuthFormProps } from './userAuthTypes';

const UserAuthForm: React.FC<UserAuthFormProps> = ({ onSubmit, headline }) => {
  const initialValues = { username: '', password: '', passwordconfirm: '' };

  const reqistrationSchema = Yup.object({
    username: Yup.string().max(20, 'Name must be 20 characters or less').min(5, 'Name must be 5 characters or more').required('Name is required'),
    password: Yup.string().max(15, 'Password must be 15 charachters or less').min(5, 'Password must be at least 5 characters').required('Password required'),
    passwordconfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Password confirmation is required'),
  });

  const loginSchema = Yup.object({
    username: Yup.string().required('Name is required'),
    password: Yup.string().required('Password required'),
  });

  const validationSchema = headline === 'Register' ? reqistrationSchema : loginSchema;

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={4} md={6} sm={8} xs={10}>
            <Card>
              <Card.Body>
                <h4>{headline}</h4>
                <hr />
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  {({ errors, touched }): JSX.Element => (
                    <Form>
                      <div className="row align-items-center justify-content-center">
                        <div style={{ flexDirection: 'column' }}>
                          <BootstrapForm.Group>
                            <BootstrapForm.Label className="formLabel">Username</BootstrapForm.Label>
                            <br />
                            <Field className="textInputField" id="username" name="username" type="text" />
                            <ErrorMessage touched={touched.username} error={errors.username} />
                          </BootstrapForm.Group>
                          <BootstrapForm.Group>
                            <BootstrapForm.Label className="formLabel">Password</BootstrapForm.Label>
                            <br />
                            <Field id="password" name="password" type="password" />
                            <ErrorMessage touched={touched.password} error={errors.password} />
                          </BootstrapForm.Group>
                          {headline === 'Register'
                            ? (
                              <BootstrapForm.Group>
                                <BootstrapForm.Label className="formLabel">Password confirmation:</BootstrapForm.Label>
                                <br />
                                <Field id="passwordconfirm" name="passwordconfirm" type="password" />
                                <ErrorMessage
                                  touched={touched.passwordconfirm}
                                  error={errors.passwordconfirm}
                                />
                              </BootstrapForm.Group>
                            )
                            : null}
                        </div>
                      </div>
                      <hr style={{ marginTop: '25px' }} />
                      <Col className="text-right">
                        <Button size="sm" variant="outline-secondary" id="reset" type="reset">Reset</Button>
                        <Button size="sm" variant="outline-dark" id="submit" type="submit" style={{ marginLeft: '5px' }}>Submit</Button>
                        <br />
                        {headline === 'Register'
                          ? (
                            <div style={{ marginTop: '15px' }}>
                              <p className="authFormInfo">Already registered?</p>
                              <p className="authFormInfo">
                                Click here to
                                <Link to="/login" className="authFormLink"> login</Link>
                              </p>
                            </div>
                          )
                          : (
                            <div style={{ marginTop: '15px' }}>
                              <p className="authFormInfo">Don&apos;t have an account?</p>
                              <p className="authFormInfo">
                                Click here to
                                <Link to="/register" className="authFormLink"> register</Link>
                              </p>
                            </div>
                          )}
                      </Col>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserAuthForm;
