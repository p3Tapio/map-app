/* eslint-disable no-console */
import React from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { AllFormValues } from './userAuthTypes';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const onSubmit = async (values: AllFormValues): Promise<void> => {
    try {
      await dispatch(registerUser({ username: values.username, password: values.password }));
      const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser') as string);
      console.log('loggedUser', loggedUser);
    } catch (err) {
      console.log('err', err);
    }
  };
  return <UserAuthForm onSubmit={onSubmit} headline="Register" />;
};

export default Register;
