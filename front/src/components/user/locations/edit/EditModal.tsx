import React, { FormEvent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import EditForm from './EditForm';
import MapComponent from '../map/MapComponent';
import MessageModal from '../../../MessageModal';
import { EditModalProps, ValidationMessage } from '../locationsTypes';
import { Location } from '../../../../state/reducers/location/locationTypes';
import { validateUpdated } from '../validation';
import { updateLocation } from '../../../../state/reducers/location/locationActions';
import { initialLocation } from '../../UserPage';

const EditModal: React.FC<EditModalProps> = ({
  show, setShow, location, setLocation, setPinPosition, pinPosition, setAddress, validationMsg, setValidationMsg, address,
}) => {
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const dispatch = useDispatch();

  const handleClose = (): void => {
    setAddress('');
    setLocation({ _id: '', createdBy: '', ...initialLocation });
    setShow(false);
  };
  const handleEdit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const editedLocation: Location = {
      _id: location._id,
      name: location.name,
      address,
      coordinates: { lat: pinPosition[0], lng: pinPosition[1] },
      description: location.description,
      category: location.category,
      imageLink: location.imageLink,
      createdBy: location.createdBy,
    };
    const validated: Location | ValidationMessage = validateUpdated(editedLocation);
    if ('name' in validated) {
      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        console.log('validated', validated)
        await dispatch(updateLocation(validated));
        setInfo({ header: 'Success', message: `Location ${validated.name} edited!` });
        setShow(false);
        setShowMsgModal(true);
        setValidationMsg({});
      } catch {
        setInfo({ header: 'Error', message: 'Woops, something went wrong!' });
      }
    } else {
      setValidationMsg(validated);
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
          <MapComponent setPinPosition={setPinPosition} pinPosition={pinPosition} setAddress={setAddress} validationMsg={validationMsg} />
          <EditForm
            location={location}
            setLocation={setLocation}
            validationMsg={validationMsg}
            handleEdit={handleEdit}
            handleClose={handleClose}
            address={address}
            setAddress={setAddress}
            setPinPosition={setPinPosition}
          />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default EditModal;
