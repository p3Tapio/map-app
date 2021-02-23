import React, { useState } from 'react';
import {
  Container, Col, Row,
} from 'react-bootstrap';
import locationService from '../../../../state/services/locationService';
import SingleLocationMap from './SingleLocationMap';

import { LocationListProps } from '../locationsTypes';
import DeleteLocationModal from './DeleteLocationModal';
import EditLocationModal from '../EditLocationModal';
import MessageModal from '../../../MessageModal';
import { initialLocation } from '../../initials';
import LocationCard from './LocationCard';

const LocationList: React.FC<LocationListProps> = ({
  locations, location, setLocation, defaultview, showDelete, setShowDelete, showEdit, setShowEdit,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [info, setInfo] = useState({ header: '', message: '' });

  if (!locations) return null;

  const handleDelete = async (locationId: string, name: string): Promise<void> => {
    try {
      await locationService.deleteLocation(locationId);
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
              <LocationCard
                key={x._id}
                type="user"
                location={x}
                setLocation={setLocation}
                setShowMap={setShowMap}
                setShowDelete={setShowDelete}
                setShowEdit={setShowEdit}
              />
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
