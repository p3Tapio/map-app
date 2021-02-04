import React, { FormEvent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import MapComponent from './map/MapComponent';
import MessageModal from '../../MessageModal';
import { EditModalProps, LocationValidationMessage } from './locationsTypes';
import { Location } from '../../../state/reducers/location/locationTypes';
import { validateUpdated } from '../validation';
import { updateLocation } from '../../../state/reducers/location/locationActions';
import LocationForm from './LocationsForm';
import { initialLocation } from '../initials';

const EditLocationModal: React.FC<EditModalProps> = ({
  show, setShow, location, setLocation, defaultview,
}) => {
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [address, setAddress] = useState('');
  const [locationValidationMsg, setLocationValidationMsg] = useState<LocationValidationMessage>({});
  const dispatch = useDispatch();

  const handleClose = (): void => {
    setShow(false);
    setAddress('');
    setLocationValidationMsg({});
  };
  const handleEdit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const editedLocation: Location = { ...location, address };
    const validated: Location | LocationValidationMessage = validateUpdated(editedLocation);
    if ('name' in validated) {
      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(updateLocation(validated));
        setInfo({ header: 'Success', message: `Location ${validated.name} edited!` });
        setShow(false);
        setShowMsgModal(true);
        setLocationValidationMsg({});
        setLocation(initialLocation);
      } catch {
        setInfo({ header: 'Error', message: 'Woops, something went wrong!' });
        setShowMsgModal(true);
      }
    } else {
      setLocationValidationMsg(validated);
    }
  };

  if (!location) return null;
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            location={location}
            setLocation={setLocation}
            validationMsg={locationValidationMsg}
            address={address}
            setAddress={setAddress}
            defaultview={defaultview}
          />
          <LocationForm
            location={location}
            setLocation={setLocation}
            validationMsg={locationValidationMsg}
            onSubmit={handleEdit}
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

export default EditLocationModal;
