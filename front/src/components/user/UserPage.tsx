import React, { useState, useEffect } from 'react';
import {
  Container, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../state/store';
import { getUser } from '../../state/localStore';
import { getUserLocations } from '../../state/reducers/location/locationActions';
import CreateNewModal from './create/CreateNewModal';
import LocationList from './locations/LocationList';

const UserPage: React.FC = () => {
  const user = getUser();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const locations = useSelector((state: RootStore) => state.locations.userLocations);

  useEffect(() => {
    dispatch(getUserLocations());
  }, [dispatch]);

  const handleCreateNewClick = (): void => {
    setShow(true);
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
        <LocationList locations={locations} />
      </Container>
      <CreateNewModal setShow={setShow} show={show} />
    </>
  );
};

export default UserPage;
