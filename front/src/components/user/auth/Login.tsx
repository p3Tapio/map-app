/* eslint-disable no-console */
import React from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { LoginFormValues } from './userAuthTypes';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await dispatch(loginUser({ username: values.username, password: values.password }));
      const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser') as string);
      console.log('response', response)
      console.log('loggedUser', loggedUser);
    } catch (err) {
      console.log('err', err);
    }
  };

  return <UserAuthForm onSubmit={onSubmit} headline="Login" />;
};

export default Login;
