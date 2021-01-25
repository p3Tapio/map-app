import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import CreateNewForm from './CreateNewForm';
import MapComponent from '../map/MapComponent';

import { CreateNewModalProps, ValidationMessage } from '../locationsTypes';
import { createNewLocation } from '../../../../state/reducers/location/locationActions';
import { validateNewLocation } from '../validation';
import { NewLocation } from '../../../../state/reducers/location/locationTypes';
import MessageModal from '../../../MessageModal';
import { initialLocation } from '../../UserPage';

const CreateNewModal: React.FC<CreateNewModalProps> = ({
  setShow, show, setAddress, address, pinPosition, setPinPosition, location, setLocation, validationMsg, setValidationMsg,
}) => {
  const dispatch = useDispatch();
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);

  const handleClose = (): void => {
    setAddress('');
    setLocation(initialLocation);
    setShow(false);
    setValidationMsg({});
    setPinPosition([0, 0]);
  };

  const onSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const newLocation = {
      name: location.name,
      address,
      coordinates: { lat: pinPosition[0], lng: pinPosition[1] },
      description: location.description,
      category: location.category,
      imageLink: location.imageLink,
    };
    const validated: NewLocation | ValidationMessage = validateNewLocation(newLocation);
    if ('name' in validated) {
      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(createNewLocation(validated));
        setInfo({ header: 'Success', message: 'New location added!' });
        setShow(false);
        setShowMsgModal(true);
        setValidationMsg({});
        setPinPosition([0, 0]);
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
            Create new entry
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            setPinPosition={setPinPosition}
            pinPosition={pinPosition}
            setAddress={setAddress}
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
