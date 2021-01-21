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
import MessageModal from '../../MessageModal';

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
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const handleClose = (): void => {
    setAddress('');
    setLocation(initialLocation);
    setPinPosition([0, 0]);
    setShow(false);
    setValidationMsg({});
  };

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

    const validated: NewLocation | ValidationMessage = validateLocation(newLocation);
    if ('name' in validated) {
      try {
        dispatch(createNewLocation(validated));
        setInfo({ header: 'Success', message: 'New location added!' });
        setShow(false);
        setShowMsgModal(true);
        setValidationMsg({});
      } catch {
        setInfo({ header: 'Error', message: 'Oh no, something went wrong! Try again.' });
      }
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
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default CreateNewModal;
