import React from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DefaultViewMap from './DefaultViewMap';
import { CreateNewListModalProps } from './listTypes';
import ListForm from './ListForm';

const CreateNewListModal: React.FC<CreateNewListModalProps> = ({
  show, setShow, newList, setNewList,
}) => {
  function handleClose(): void {
    setShow(false);
  }

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
          />
          <ListForm handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </>
  );
};

export default CreateNewListModal;
