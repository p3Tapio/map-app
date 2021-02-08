import React, { FormEvent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import MessageModal from '../../MessageModal';
import DefaultViewMap from './DefaultViewMap';
import ListForm from './ListForm';
import { EditListModalProps, ListValidationMessage } from './listTypes';
import { validateUpdatedList } from '../validation';
import { List } from '../../../state/reducers/list/listTypes';
import { updateList } from '../../../state/reducers/list/listActions';

const EditListModal: React.FC<EditListModalProps> = ({
  show, setShow, list, setList,
}) => {
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [listValidationMsg, setListValidationMsg] = useState<ListValidationMessage>({});
  const dispatch = useDispatch();

  const handleClose = (): void => {
    setShow(false);
  };
  const handleEdit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    const validated: List | ListValidationMessage = validateUpdatedList(list);
    if ('name' in validated) {
      try {
        // TODO testaa onko arvot muuttuneet?
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(updateList(validated));
        setInfo({ header: 'Success', message: `${validated.name} updated!` });
        setShow(false);
        setShowMsgModal(true);
        setListValidationMsg({});
      } catch {
        setInfo({ header: 'Error', message: 'Woops, something went wrong!' });
        setShowMsgModal(true);
      }
    } else {
      setListValidationMsg(validated);
    }
  };

  if (!list) return null;
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DefaultViewMap list={list} setList={setList} validationMsg={listValidationMsg} />
          <ListForm
            handleClose={handleClose}
            handleSubmit={handleEdit}
            list={list}
            setList={setList}
            validationMsg={listValidationMsg}
            formType="edit"
          />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default EditListModal;
