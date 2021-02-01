import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import DefaultViewMap from './DefaultViewMap';
import { CreateNewListModalProps, ListValidationMessage } from './listTypes';
import { NewList } from '../../../state/reducers/list/listTypes';
import ListForm from './ListForm';
import { validateNewList } from '../validation';
import { createNewList } from '../../../state/reducers/list/listActions';
import MessageModal from '../../MessageModal';

const CreateNewListModal: React.FC<CreateNewListModalProps> = ({
  show, setShow, newList, setNewList,
}) => {
  const [listValidationMsg, setListValidationMsg] = useState<ListValidationMessage>({});
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const dispatch = useDispatch();

  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  const handleClose = (): void => {
    setShow(false);
  };

  const handleSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    let country = 'unknown';
    let place = 'unknown';
    const response = await axios.get(
      `${mapBoxUrl}/${newList.defaultview.lng},${newList.defaultview.lat}.json?access_token=${process.env.REACT_APP_MAPBOX}`,
    );
    if (response.data.features.length > 0) {
      response.data.features.filter((x: { id: string; text: string }) => {
        if (x.id.includes('country')) country = x.text;
        if (x.id.includes('place')) place = x.text;
        return null;
      });
      const list = {
        ...newList, place, country,
      };
      const validated: NewList | ListValidationMessage = validateNewList(list);
      if ('name' in validated) {
        try {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await dispatch(createNewList(validated));
          setInfo({ header: 'Success', message: 'New list created!' });
          setShow(false);
          setShowMsgModal(true);
          setListValidationMsg({});
        } catch {
          setInfo({ header: 'Error', message: 'Oh no, something went wrong! Try again.' });
          setShowMsgModal(true);
        }
      } else {
        setListValidationMsg(validated);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Create new list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayTrigger
            placement="auto"
            overlay={(
              <Tooltip id="editTooltip">
                Set a default view for your list!
              </Tooltip>
            )}
          >
            <label style={{ marginLeft: '25px' }}>Default view</label>
          </OverlayTrigger>
          <DefaultViewMap
            newList={newList}
            setNewList={setNewList}
            validationMsg={listValidationMsg}
          />
          <ListForm
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            newList={newList}
            setNewList={setNewList}
            validationMsg={listValidationMsg}
          />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default CreateNewListModal;
