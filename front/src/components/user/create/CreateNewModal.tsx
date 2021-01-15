import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

import CreateNewForm from './CreateNewForm';
import MapComponent from './MapComponent';

import { NewEntry, CreateNewModalProps } from './NewEntryTypes';

const CreateNewModal: React.FC<CreateNewModalProps> = ({ setShow, show }) => {
  const [pinPosition, setPinPosition] = useState([0, 0]);
  const [address, setAddress] = useState('');
  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const handleClose = (): void => {
    setPinPosition([0, 0]);
    setShow(false);
  };

  const onSubmit = async (values: NewEntry): Promise<void> => {
    if (pinPosition[0] === 0) {
      const response = await axios.get(`${mapBoxUrl}/${values.address}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
      setPinPosition(
        [response.data.features[0].geometry.coordinates[1],
          response.data.features[0].geometry.coordinates[0]],
      );
    }
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
        />
        <CreateNewForm onSubmit={onSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default CreateNewModal;
