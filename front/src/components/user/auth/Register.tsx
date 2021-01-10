/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable no-console */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { AllFormValues } from './userAuthTypes';

interface RegProps {
  setLogged: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const Register: React.FC<RegProps> = ({ setLogged }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = async (values: AllFormValues): Promise<void> => {
    try {
      await dispatch(registerUser({ username: values.username, password: values.password }));
      setLogged(true);
      history.push('/userpage');
    } catch (err) {
      console.log('err', err);
    }
  };
  return <UserAuthForm onSubmit={onSubmit} headline="Register" />;
};

export default Register;
