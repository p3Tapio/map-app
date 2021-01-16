/* eslint-disable no-console */
import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

import CreateNewForm from './CreateNewForm';
import MapComponent from './MapComponent';

import { CreateNewModalProps } from './NewEntryTypes';

const CreateNewModal: React.FC<CreateNewModalProps> = ({ setShow, show }) => {
  const [location, setLocation] = useState({
    name: '',
    address: '',
    coordinates: { lat: 0, lng: 0 },
    description: '',
    category: '',
    imageLink: '',
  });
  const [address, setAddress] = useState('');
  const [pinPosition, setPinPosition] = useState([0, 0]);

  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  console.log('location', location);

  const handleClose = (): void => {
    setPinPosition([0, 0]);
    setShow(false);
  };

  const onSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    setLocation({
      ...location,
      address,
      coordinates: {
        lat: pinPosition[0],
        lng: pinPosition[1],
      },
    });
    if (location.coordinates.lat === 0) {
      const response = await axios.get(`${mapBoxUrl}/${address}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
      setLocation({
        ...location,
        coordinates: {
          lat: response.data.features[0].geometry.coordinates[1],
          lng: response.data.features[0].geometry.coordinates[0],
        },
      });
      console.log('location ----  : ', location);
    }
    console.log('location ----  : ', location);
  };
  return (
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
        />
        <CreateNewForm
          onSubmit={onSubmit}
          location={location}
          setLocation={setLocation}
          address={address}
          setAddress={setAddress}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CreateNewModal;
