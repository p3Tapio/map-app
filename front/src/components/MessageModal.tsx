import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { RootStore } from '../state/store';

interface ModalProps {
  info: {
    message: string;
    header: string;
  };
  setInfo: React.Dispatch<React.SetStateAction<{ header: string; message: string }>>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageModal: React.FC<ModalProps> = ({
  setInfo, info, setShow, show,
}) => {
  const history = useHistory();
  const lists = useSelector((state: RootStore) => state.lists.userLists);
  const handleClose = (): void => {
    setShow(false);
    setInfo({ message: '', header: '' });
    if (info.header === 'Success' && info.message.includes('Welcome')) history.push('/userpage');
    if (info.header === 'Success' && info.message === 'New list created!' && lists) {
      const last = lists.pop();
      if (last) history.push(`/list/${last._id}`);
    }
  };

  return (
    <Modal show={show} size="sm" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {info.header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{info.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="outline-dark" type="button" onClick={handleClose}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
