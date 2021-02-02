import React, { useState } from 'react';
import {
  Container, Card, Col, Row, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import SingleLocationMap from './SingleLocationMap';
import altImg from '../../../../style/images/bluepin.png';
import { LocationListProps } from '../locationsTypes';
import DeleteLocationModal from './DeleteLocationModal';
import EditLocationModal from '../EditLocationModal';
import MessageModal from '../../../MessageModal';
import { deleteLocation } from '../../../../state/reducers/location/locationActions';
import { initialLocation } from '../../initials';

const LocationList: React.FC<LocationListProps> = ({
  locations, location, setLocation, defaultview,
}) => {
  const dispatch = useDispatch();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [info, setInfo] = useState({ header: '', message: '' });

  if (!locations) return null;

  const handleDelete = async (locationId: string, name: string): Promise<void> => { // nosta locationListiin
    try {
      // error ei putoo catchiin ilman awaittia ...
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(deleteLocation(locationId));
      setInfo({ header: 'Success', message: `Location ${name} deleted!` });
      setShowMessage(true);
      setLocation(initialLocation);
    } catch {
      setInfo({ header: 'Error', message: 'Oh no, something went wrong :(' });
      setShowMessage(true);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col className="row justify-content-center locationCardGrid">
            {locations.map((x) => (
              <Card style={{ width: '18rem', margin: '2px' }} key={x._id}>
                <Card.Header>
                  {x.name}
                </Card.Header>
                <Card.Img
                  variant="top"
                  src={x.imageLink !== '-' ? x.imageLink : altImg}
                />
                <Card.Body>
                  <Card.Text>
                    {x.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer style={{ lineHeight: 1 }}>
                  <small>
                    {x.address}
                  </small>
                  <hr />
                  <Row className="justify-content-between">
                    <Col className="text-left">
                      <p className="authFormInfo">
                        Want to view it on map?
                      </p>
                      <button
                        type="button"
                        className="locationCardBtn"
                        onClick={(): void => {
                          setLocation(x);
                          setShowMap(true);
                        }}
                      >
                        Click here!
                      </button>
                    </Col>
                    <Col className="text-right" style={{ marginTop: '10px', marginRight: '-5px' }}>
                      <OverlayTrigger
                        placement="auto"
                        overlay={
                          <Tooltip id="editTooltip">Delete location</Tooltip>
                        }
                      >
                        <button
                          type="button"
                          id="delete"
                          className="locationCardBtn"
                          onClick={(): void => {
                            setLocation(x);
                            setShowDelete(true);
                          }}
                        >
                          <Trash size={25} style={{ marginRight: '10px' }} />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="auto"
                        overlay={
                          <Tooltip id="editTooltip">Edit location details</Tooltip>
                        }
                      >
                        <button
                          type="button"
                          id="edit"
                          className="locationCardBtn"
                          onClick={(): void => {
                            setLocation(x);
                            setShowEdit(true);
                          }}
                        >
                          <Pen size={22} />
                        </button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
      <SingleLocationMap location={location} show={showMap} setShow={setShowMap} />
      {location
        ? (
          <>
            <DeleteLocationModal
              id={location._id}
              name={location.name}
              show={showDelete}
              setShow={setShowDelete}
              handleDelete={handleDelete}
            />
            <EditLocationModal
              show={showEdit}
              setShow={setShowEdit}
              location={location}
              setLocation={setLocation}
              defaultview={defaultview}
            />
          </>
        )
        : null}
      <MessageModal setInfo={setInfo} info={info} setShow={setShowMessage} show={showMessage} />
    </>
  );
};

export default LocationList;
