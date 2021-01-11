/* eslint-disable @typescript-eslint/await-thenable */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { LoginFormValues } from './userAuthTypes';
import MessageModal from './MessageModal';

interface LoginProps {
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}
const Login: React.FC<LoginProps> = ({ setLogged }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setShow(true);
    try {
      await dispatch(loginUser({ username: values.username, password: values.password }));
      setInfo({ message: `Welcome ${values.username}!`, header: 'Success' })
      setLogged(true);
    } catch (err) {
      if (err.response.data.error === 'wrong username or password') {
        const error = err.response.data.error;
        setInfo({ message: `${error.charAt(0).toUpperCase()}${error.slice(1)}!`, header: 'Error' })
      } else {
        setInfo({ message: 'Woops, something is wrong :(', header: 'Error' })
      }
    }
  };

  return (
    <>
      <UserAuthForm onSubmit={onSubmit} headline="Login" />
      {info.header === '' ? null
        : <MessageModal show={show} setShow={setShow} info={info} setInfo={setInfo} />}
    </>
  );
};

export default Login;
