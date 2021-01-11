/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../state/reducers/user/userActions';
import UserAuthForm from './UserAuthForm';
import { AllFormValues } from './userAuthTypes';
import MessageModal from './MessageModal';

interface RegProps {
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegProps> = ({ setLogged }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });

  const onSubmit = async (values: AllFormValues): Promise<void> => {
    setShow(true);
    try {
      await dispatch(registerUser({ username: values.username, password: values.password }));
      setInfo({ message: `Account created. Welcome ${values.username}!`, header: 'Success' })
      setLogged(true);
    } catch (err) {
      console.log('err.response.data.error', err.response.data.error)
      if (err.response.data.error.includes('User validation failed: username: Error, expected')) {
        setInfo({ message: `Sorry, username ${values.username} is already in use. Try another one!`, header: 'Error' })
      } else {
        setInfo({ message: 'Woops, something went wrong :(', header: 'Error' })
      }
    }
  };
  return (
    <>
      <UserAuthForm onSubmit={onSubmit} headline="Register" />
      {info.header === '' ? null
        : <MessageModal show={show} setShow={setShow} info={info} setInfo={setInfo} />}
    </>
  );
};

export default Register;
