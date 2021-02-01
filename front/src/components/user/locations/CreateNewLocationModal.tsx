import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import LocationForm from './LocationsForm';
import MapComponent from './map/MapComponent';

import { CreateNewLocationModalProps, LocationValidationMessage } from './locationsTypes';
import { createNewLocation } from '../../../state/reducers/location/locationActions';
import { validateNewLocation } from '../validation';
import { NewLocation } from '../../../state/reducers/location/locationTypes';
import MessageModal from '../../MessageModal';

const CreateNewLocationModal: React.FC<CreateNewLocationModalProps> = ({
  setShow, show, location, setLocation, validationMsg, setValidationMsg,
}) => {
  const dispatch = useDispatch();
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [address, setAddress] = useState('');

  const handleClose = (): void => {
    setShow(false);
    setAddress('');
    setValidationMsg({});
  };

  const onSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const newLocation = { ...location, address };
    const validated: NewLocation | LocationValidationMessage = validateNewLocation(newLocation);
    if ('name' in validated) {
      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(createNewLocation(validated));
        setInfo({ header: 'Success', message: 'New location added!' });
        setShow(false);
        setShowMsgModal(true);
        setValidationMsg({});
      } catch { // TODO: 400 ainakaa ei putoa tänne ???
        setInfo({ header: 'Error', message: 'Oh no, something went wrong! Try again.' });
        setShowMsgModal(true);
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
            Create new entry
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            location={location}
            setLocation={setLocation}
            validationMsg={validationMsg}
            address={address}
            setAddress={setAddress}
          />
          <LocationForm
            onSubmit={onSubmit}
            location={location}
            setLocation={setLocation}
            validationMsg={validationMsg}
            handleClose={handleClose}
            address={address}
            setAddress={setAddress}
          />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default CreateNewLocationModal;
