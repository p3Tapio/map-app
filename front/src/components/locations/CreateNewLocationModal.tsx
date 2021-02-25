import React, { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import LocationForm from './LocationsForm';
import MapComponent from './map/MapComponent';

import { CreateNewLocationModalProps, LocationValidationMessage } from './locationsTypes';
import locationService from '../../state/services/locationService';
import { validateNewLocation } from '../validation';
import { NewLocation } from '../../state/services/locationTypes';
import MessageModal from '../MessageModal';
import { initialLocation } from '../initials';

const CreateNewLocationModal: React.FC<CreateNewLocationModalProps> = ({
  setShow, show, defaultview, userListLocations,
}) => {
  const { id } = useParams<{ id?: string }>();
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [locationValidationMsg, setLocationValidationMsg] = useState<LocationValidationMessage>({});
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');

  const handleClose = (): void => {
    setShow(false);
    setAddress('');
    setLocationValidationMsg({});
    setLocation(initialLocation); // koita muualla jos kaatuilee, kartta heittää välillä errorin puuttuvasta sijainnista.
  };

  const onSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const newLocation = { ...location, address, list: id };
    const validated: NewLocation | LocationValidationMessage = validateNewLocation(newLocation);
    if ('name' in validated) {
      try {
        await locationService.createNewLocation(validated);
        setInfo({ header: 'Success', message: 'New location added!' });
        setShow(false);
        setShowMsgModal(true);
        setAddress('');
        setLocation(initialLocation);
        setLocationValidationMsg({});
      } catch { // TODO: 400 ei pudonnut tänne ???
        setInfo({ header: 'Error', message: 'Oh no, something went wrong! Try again.' });
        setShowMsgModal(true);
      }
    } else {
      setLocationValidationMsg(validated);
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
            validationMsg={locationValidationMsg}
            address={address}
            setAddress={setAddress}
            defaultview={defaultview}
            userListLocations={userListLocations}
          />
          <LocationForm
            onSubmit={onSubmit}
            location={location}
            setLocation={setLocation}
            validationMsg={locationValidationMsg}
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
