import React, { useState, useEffect } from 'react';
import {
  Container, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../state/store';
import { getUser } from '../../state/localStore';
import { getUserLocations, deleteLocation } from '../../state/reducers/location/locationActions';
import CreateNewModal from './create/CreateNewModal';
import LocationList from './locations/LocationList';
import MessageModal from '../MessageModal';

const UserPage: React.FC = () => {
  const user = getUser();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });
  const dispatch = useDispatch();
  const locations = useSelector((state: RootStore) => state.locations.userLocations);

  useEffect(() => { dispatch(getUserLocations()); }, [dispatch]);

  const handleCreateNewClick = (): void => {
    setShow(true);
  };
  const handleDelete = async (id: string, name: string): Promise<void> => {
    try {
      setShowDelete(false);
      // error ei putoo catchiin ilman awaittia ...
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(deleteLocation(id));
      setInfo({ header: 'Success', message: `Location ${name} deleted!` });
      setShowMessage(true);
    } catch {
      setInfo({ header: 'Error', message: 'Oh no, something went wrong :(' });
      setShowMessage(true);
    }
  };
  if (!user && !locations) return null;
  return (
    <>
      <Container className="mt-5">
        <h4>
          Hi,
          {' '}
          {user.username}
          !
        </h4>
        <p>
          {!locations || locations.length === 0
            ? 'Seems like you have not yet added any locations. You can start by adding one by clicking the create new button!'
            : 'Below you can see the locations that you have added to the map. You can create a new one by clicking the create new button!'}
        </p>
        <Button onClick={handleCreateNewClick} size="sm" variant="outline-secondary">Create New</Button>
        <hr />
        <LocationList locations={locations} handleDelete={handleDelete} setShowDelete={setShowDelete} showDelete={showDelete} />
      </Container>
      <CreateNewModal setShow={setShow} show={show} />
      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default UserPage;
