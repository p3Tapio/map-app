import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserLists } from '../../../state/reducers/list/listActions';
import { List } from '../../../state/reducers/list/listTypes';
import { RootStore } from '../../../state/store';
import { initialLocation } from '../initials';
import CreateNewLocationModal from '../locations/CreateNewLocationModal';
import LocationList from '../locations/locationList/LocationList';
import ListLocationsMap from './ListLocationsMap';

const ListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const list = useSelector((state: RootStore) => state.lists.userLists?.find((x: List) => x._id === id));
  const [showCreate, setShowCreate] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => { dispatch(getUserLists()); }, [dispatch, showCreate]);
  if (!list) return null;

  return (
    <>
      <Container className="mt-5">
        <h4>{list.name}</h4>
        <p>
          {list.place}
          ,
          {' '}
          {list.country}
        </p>
        <p>
          {!list.locations || list.locations.length === 0
            ? 'Seems like you have not added any locations to your list yet. You can start by clicking the add location button!'
            : list.description}
        </p>
        <Button size="sm" variant="outline-secondary" onClick={(): void => setShowCreate(true)}>
          Add location
        </Button>
        <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }} onClick={(): void => setShowMap(!showMap)}>
          {showMap ? 'View locations' : 'View map'}
        </Button>
        <hr />
        {!showMap && (
          <LocationList
            locations={list.locations}
            location={location}
            setLocation={setLocation}
            defaultview={list.defaultview}

          />
        )}
        {showMap && (
          <ListLocationsMap
            locations={list.locations}
            defaultview={list.defaultview}
          />
        )}
      </Container>
      <CreateNewLocationModal
        setShow={setShowCreate}
        show={showCreate}
        defaultview={list.defaultview}
      />
    </>
  );
};

export default ListPage;
