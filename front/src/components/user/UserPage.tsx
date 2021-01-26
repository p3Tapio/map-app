import React, { useState, useEffect } from 'react';
import {
  Container, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../state/store';
import { getUser } from '../../state/localStore';
import { getUserLocations, deleteLocation } from '../../state/reducers/location/locationActions';
import CreateNewModal from './locations/CreateNewModal';
import LocationList from './locations/locationList/LocationList';
import MessageModal from '../MessageModal';
import { ValidationMessage } from './locations/locationsTypes';

export const initialLocation = {
  _id: '',
  name: '',
  address: '',
  coordinates: { lat: 0, lng: 0 },
  description: '',
  category: '',
  imageLink: '',
  createdBy: '',
};

const UserPage: React.FC = () => {
  const user = getUser();

  const [showCreate, setShowCreate] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });
  const [address, setAddress] = useState('');
  const [pinPosition, setPinPosition] = useState([0, 0]);
  const [validationMsg, setValidationMsg] = useState<ValidationMessage>({});
  const [location, setLocation] = useState(initialLocation);

  const dispatch = useDispatch();
  const locations = useSelector((state: RootStore) => state.locations.userLocations);

  useEffect(() => { dispatch(getUserLocations()); }, [dispatch]);

  const handleCreateNewClick = (): void => {
    setLocation(initialLocation);
    setPinPosition([0, 0]);
    setAddress('');
    setShowCreate(true);
  };

  const handleDelete = async (id: string, name: string): Promise<void> => {
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
            ? 'Seems like you have not yet added any locations. You can start by adding one by clicking the create new button!'
            : 'Below you can see the locations that you have added to the map. You can create a new one by clicking the create new button!'}
        </p>
        <Button onClick={handleCreateNewClick} size="sm" variant="outline-secondary">Create New</Button>
        <hr />
        <LocationList
          locations={locations}
          handleDelete={handleDelete}
          setPinPosition={setPinPosition}
          pinPosition={pinPosition}
          address={address}
          setAddress={setAddress}
          validationMsg={validationMsg}
          setValidationMsg={setValidationMsg}
          location={location}
          setLocation={setLocation}
        />
      </Container>
      <CreateNewModal
        setShow={setShowCreate}
        show={showCreate}
        address={address}
        setAddress={setAddress}
        pinPosition={pinPosition}
        setPinPosition={setPinPosition}
        validationMsg={validationMsg}
        setValidationMsg={setValidationMsg}
        location={location}
        setLocation={setLocation}
      />
      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default UserPage;
