import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DefaultViewMap from './DefaultViewMap';
import { CreateNewListModalProps, ListValidationMessage } from './listTypes';
import { List, NewList } from '../../state/reducers/list/listTypes';
import ListForm from './ListForm';
import { validateNewList } from '../validation';
import { createNewList } from '../../state/reducers/list/listActions';
import MessageModal from '../MessageModal';

const CreateNewListModal: React.FC<CreateNewListModalProps> = ({
  show, setShow, list, setList,
}) => {
  const [listValidationMsg, setListValidationMsg] = useState<ListValidationMessage>({});
  const [info, setInfo] = useState({ header: '', message: '' });
  const [showMsgModal, setShowMsgModal] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const handleClose = (): void => {
    setShow(false);
  };

  const handleSubmit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault();
    let country = 'unknown';
    let place = 'unknown';
    const response = await axios.get(
      `${mapBoxUrl}/${list.defaultview.lng},${list.defaultview.lat}.json?access_token=${process.env.MAPBOX_TOKEN}`,
    );
    if (response.data.features.length > 0) {
      response.data.features.filter((x: { id: string; text: string }) => {
        if (x.id.includes('country')) country = x.text;
        if (x.id.includes('place')) place = x.text;
        return null;
      });
    }
    const newList = {
      ...list, place, country,
    };
    const validated: NewList | ListValidationMessage = validateNewList(newList);
    if ('name' in validated) {
      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const res: List = await dispatch(createNewList(validated));
        setInfo({ header: 'Success', message: 'New list created!' });
        setShow(false);
        setListValidationMsg({});
        history.push({
          state: { newList: true },
          pathname: `/list/${res._id}`,
        });
      } catch {
        setInfo({ header: 'Error', message: 'Oh no, something went wrong! Try again.' });
        setShowMsgModal(true);
      }
    } else {
      setListValidationMsg(validated);
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
            list={list}
            setList={setList}
            validationMsg={listValidationMsg}
          />
          <ListForm
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            list={list}
            setList={setList}
            validationMsg={listValidationMsg}
            formType="create"
          />
        </Modal.Body>
      </Modal>
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default CreateNewListModal;
