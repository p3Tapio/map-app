/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/await-thenable */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { LoginFormValues } from './userAuthTypes';

interface LoginProps {
  setLogged: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const Login: React.FC<LoginProps> = ({ setLogged }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await dispatch(loginUser({ username: values.username, password: values.password }));
      setLogged(true);
      history.push('/userpage');
    } catch (err) {
      console.log('err', err);
    }
  };

  return <UserAuthForm onSubmit={onSubmit} headline="Login" />;
};

export default Login;
