/* eslint-disable no-console */
import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

import CreateNewForm from './CreateNewForm';
import MapComponent from './MapComponent';

import { CreateNewModalProps, ValidationMessage } from './NewEntryTypes';
import { createNewLocation } from '../../../state/reducers/location/locationActions';
import { validateLocation } from './validation';
import { NewLocation } from '../../../state/reducers/location/locationTypes';

const CreateNewModal: React.FC<CreateNewModalProps> = ({ setShow, show }) => {
  const dispatch = useDispatch();
  const initialLocation = {
    name: '',
    address: '',
    coordinates: { lat: 0, lng: 0 },
    description: '',
    category: '',
    imageLink: '',
  };
  const [validationMsg, setValidationMsg] = useState<ValidationMessage>({});
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [pinPosition, setPinPosition] = useState([0, 0]);
  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const handleClose = (): void => {
    setAddress('');
    setLocation(initialLocation);
    setPinPosition([0, 0]);
    setShow(false);
    setValidationMsg({});
  };
  // TODO
  // try catch ja joku viesti onnistuneesta tallennuksesta 
  const onSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    let newLocation = {
      name: location.name,
      address,
      coordinates: { lat: pinPosition[0], lng: pinPosition[1] },
      description: location.description,
      category: location.category,
      imageLink: location.imageLink,
    };
    if (newLocation.coordinates.lat === 0 && address !== '') {
      const response = await axios.get(`${mapBoxUrl}/${address}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
      if (response.data.features[0]) {
        newLocation = {
          ...newLocation,
          coordinates: {
            lat: response.data.features[0].geometry.coordinates[1],
            lng: response.data.features[0].geometry.coordinates[0],
          },
        };
      }
    }
    console.log('location: ---- ', newLocation);
    const validated: NewLocation | ValidationMessage = validateLocation(newLocation);
    if ('name' in validated) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(createNewLocation(validated));
      setValidationMsg({});
    } else {
      setValidationMsg(validated);
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Create new entry</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            setPinPosition={setPinPosition}
            pinPosition={pinPosition}
            setAddress={setAddress}
            address={address}
            location={location}
            setLocation={setLocation}
            validationMsg={validationMsg}
          />
          <CreateNewForm
            onSubmit={onSubmit}
            location={location}
            setLocation={setLocation}
            address={address}
            setAddress={setAddress}
            setPinPosition={setPinPosition}
            validationMsg={validationMsg}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateNewModal;
