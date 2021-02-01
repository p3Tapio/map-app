import React, { useState, useEffect } from 'react';
import {
  Container, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../state/store';
import { getUser } from '../../state/localStore';
import { getUserLocations, deleteLocation } from '../../state/reducers/location/locationActions';
import LocationList from './locations/locationList/LocationList';
import ListList from './lists/ListList'
import MessageModal from '../MessageModal';
import { LocationValidationMessage } from './locations/locationsTypes';
import CreateNewLocationModal from './locations/CreateNewLocationModal';
import CreateNewListModal from './lists/CreateNewListModal';
import { initialList, initialLocation } from './initials';
import { getPublicLists, getUserLists } from '../../state/reducers/list/listActions';

const UserPage: React.FC = () => {
  const user = getUser();

  const [showCreateList, setShowCreateList] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });
  const [LocationValidationMsg, setLocationValidationMsg] = useState<LocationValidationMessage>({});
  const [newList, setNewList] = useState(initialList);
  const [location, setLocation] = useState(initialLocation);

  const dispatch = useDispatch();
  const locations = useSelector((state: RootStore) => state.locations.userLocations);
  const lists = useSelector((state: RootStore) => state.lists);

  console.log('lists', lists)
  useEffect(() => {
    dispatch(getUserLocations());
    dispatch(getPublicLists());
    dispatch(getUserLists())
  }, [dispatch]);

  const handleCreateNewClick = (): void => {
    setNewList(initialList);
    setLocation(initialLocation);
    setShowCreateList(true);
  };

  const handleDelete = async (id: string, name: string): Promise<void> => { // nosta locationListiin
    try {
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
            ? 'Seems like you have not created any location lists yet. You can start by clicking the create new button!'
            : 'Below you can see the location lists that you have created.'}
        </p>
        <Button onClick={handleCreateNewClick} size="sm" variant="outline-secondary">Create New</Button>
        <hr />
        <ListList />

        {/* <LocationList
          locations={locations}
          handleDelete={handleDelete}
          validationMsg={locationValidationMsg}
          setValidationMsg={setLocationValidationMsg}
          location={location}
          setLocation={setLocation}
        /> */}
      </Container>
      <CreateNewListModal
        show={showCreateList}
        setShow={setShowCreateList}
        newList={newList}
        setNewList={setNewList}
      />
      {/* <CreateNewLocationModal
        setShow={setShowCreate}
        show={showCreate}
          validationMsg={locationValidationMsg}
          setValidationMsg={setLocationValidationMsg}
        location={location}
        setLocation={setLocation}
      /> */}

      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default UserPage;
