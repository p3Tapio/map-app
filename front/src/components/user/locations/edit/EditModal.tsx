import React, { FormEvent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import EditForm from './EditForm';
import MapComponent from '../map/MapComponent';
import MessageModal from '../../../MessageModal';
import { EditModalProps, ValidationMessage } from '../locationsTypes';
import { NewLocation } from '../../../../state/reducers/location/locationTypes';
import { validateLocation } from '../validation';

const EditModal: React.FC<EditModalProps> = ({
  show, setShow, location, setLocation, setPinPosition, pinPosition, setAddress, validationMsg, setValidationMsg, address,
}) => {
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleEdit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const editedLocation = {
      _id: location._id,
      name: location.name,
      address,
      coordinates: { lat: pinPosition[0], lng: pinPosition[1] },
      description: location.description,
      category: location.category,
      imageLink: location.imageLink,
      createdBy: location.createdBy,
    };
    const validated: NewLocation | ValidationMessage = validateLocation(editedLocation);
    if ('name' in validated) {
      console.log('validated', validated);
      setInfo({ header: 'Success', message: `Location ${validated.name} edited!` });
      setShow(false);
      setShowMsgModal(true);
      setValidationMsg({});
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
          <EditForm location={location} setLocation={setLocation} validationMsg={validationMsg} handleEdit={handleEdit} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default EditModal;
