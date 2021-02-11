import React, { useState } from 'react';
import {
  Accordion, Button, Card, Col, Row,
} from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteList } from '../../../state/reducers/list/listActions';
import MessageModal from '../../MessageModal';
import { initialList } from '../initials';
import DeleteLocationModal from '../locations/locationList/DeleteLocationModal';
import { ListListProps } from './listTypes';

const ListList: React.FC<ListListProps> = ({
  userLists, showDelete, setShowDelete,
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
                        <Col className="text-right">
                          <Button
                            type="button"
                            variant="outline-danger"
                            style={{
                              padding: '5px', paddingLeft: '10px', paddingRight: '10px', marginRight: '5px',
                            }}
                            onClick={(): void => {
                              setList(x);
                              setShowDelete(true);
                            }}
                          >
                            Delete
                            {' '}
                            <Trash size={20} style={{ marginRight: '10px' }} />
                          </Button>
                          <Link to={`/list/${x._id}`}>
                            <Button
                              type="button"
                              variant="outline-secondary"
                              style={{ padding: '5px', paddingLeft: '10px', paddingRight: '10px' }}
                            >
                              Edit
                              {' '}
                              <Pen size={20} style={{ marginLeft: '10px' }} />
                            </Button>
                          </Link>
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
          </>
        ) : null}
      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default ListList;
