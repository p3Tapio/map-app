import React, { useState } from 'react';
import {
  Accordion, Card, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteList } from '../../../state/reducers/list/listActions';
import MessageModal from '../../MessageModal';
import { initialList } from '../initials';
import DeleteLocationModal from '../locations/locationList/DeleteLocationModal';
import EditListModal from './EditListModal';
import { ListListProps } from './listTypes';

const ListList: React.FC<ListListProps> = ({
  userLists, showDelete, setShowDelete, showEdit, setShowEdit,
}) => {
  const dispatch = useDispatch();
  const [list, setList] = useState(initialList);
  const [showMessage, setShowMessage] = useState(false);
  const [info, setInfo] = useState({ header: '', message: '' });

  const handleDelete = (listId: string, name: string): void => {
    try {
      dispatch(deleteList(listId));
      setInfo({ header: 'Success', message: `List ${name} deleted!` });
      setShowMessage(true);
      setList(initialList);
    } catch {
      setInfo({ header: 'Error', message: 'Oh no, something went wrong :(' });
      setShowMessage(true);
    }
  };

  if (!userLists) return null;

  return (
    <>
      <div>
        <Accordion>
          {userLists
            ? userLists.map((x) => (
              <Card style={{ marginBottom: '2px', borderRadius: '10px' }} key={x._id}>
                <Accordion.Toggle as={Card.Header} eventKey={x._id}>
                  {(x.country !== 'unknown' && x.place !== 'unknown' && `${x.name} - ${x.place}, ${x.country}`)}
                  {(x.country !== 'unknown' && x.place === 'unknown' && `${x.name} - ${x.country}`)}
                  {(x.country === 'unknown' && x.place !== 'unknown' && `${x.name} - ${x.place}`)}
                  {(x.country === 'unknown' && x.place === 'unknown' && `${x.name}`)}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={x._id}>
                  <Card.Body style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                    <div className="px-4 mb-4">
                      {x.description}
                      <ul>
                        {x.locations.map((y) => (
                          <li key={y._id}>
                            {y.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-footer">
                      <Row className="justify-content-between">
                        <Col className="text-left">
                          <Link to={`/list/${x._id}`} style={{ color: 'inherit', textDecoration: 'inherit', marginLeft: '5px' }}>
                            <button
                              type="button"
                              className="locationCardBtn"
                            >
                              Click here to see the locations and add more!
                            </button>
                          </Link>
                        </Col>
                        <Col className="text-right" style={{ marginBottom: '5px' }}>
                          <OverlayTrigger
                            placement="auto"
                            overlay={
                              <Tooltip id="editTooltip">Delete list</Tooltip>
                            }
                          >
                            <button
                              type="button"
                              id="delete"
                              className="locationCardBtn"
                              onClick={(): void => {
                                setList(x);
                                setShowDelete(true);
                              }}
                            >
                              <Trash size={25} style={{ marginRight: '10px' }} />
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="auto"
                            overlay={
                              <Tooltip id="editTooltip">Edit list details</Tooltip>
                            }
                          >
                            <button
                              type="button"
                              id="edit"
                              className="locationCardBtn"
                              onClick={(): void => {
                                setList(x);
                                setShowEdit(true);
                              }}
                            >
                              <Pen size={22} />
                            </button>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))
            : null}
        </Accordion>
      </div>
      {list // tämä ei kätsää tyhjää, mutta onko edes tarpeen?
        ? (
          <>
            <DeleteLocationModal
              id={list._id}
              name={list.name}
              show={showDelete}
              setShow={setShowDelete}
              handleDelete={handleDelete}
            />
            <EditListModal
              show={showEdit}
              setShow={setShowEdit}
              list={list}
              setList={setList}
            />
          </>
        ) : null}
      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default ListList;
