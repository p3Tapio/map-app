import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getUser } from '../../../state/localStore';
import { getUserLists } from '../../../state/reducers/list/listActions';
import { List } from '../../../state/reducers/list/listTypes';
import { RootStore } from '../../../state/store';
import { initialList, initialLocation } from '../initials';
import CreateNewLocationModal from '../locations/CreateNewLocationModal';
import LocationList from '../locations/locationList/LocationList';
import EditListModal from './EditListModal';
import ListLocationsMap from './ListLocationsMap';

const ListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const userlist = useSelector((state: RootStore) => state.lists.userLists?.find((x: List) => {
    if (x._id === id) return x;
    return history.push('/userpage');
  }));
  const user = getUser();
  const [showCreate, setShowCreate] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [list, setList] = useState(initialList);

  useEffect(() => {
    dispatch(getUserLists());
  }, [dispatch, showCreate, showEdit]);

  if (!userlist) return null;

  if (user.id !== userlist.createdBy) history.push('/userpage');
  return (
    <>
      <Container className="mt-5">
        <h4>{userlist.name}</h4>
        <p>
          {(userlist.country !== 'unknown' && userlist.place !== 'unknown' && `${userlist.place}, ${userlist.country}`)}
          {(userlist.country !== 'unknown' && userlist.place === 'unknown' && `${userlist.country}`)}
          {(userlist.country === 'unknown' && userlist.place !== 'unknown' && `${userlist.place}`)}
        </p>
        <p>
          {!userlist.locations || userlist.locations.length === 0
            ? 'Seems like you have not added any locations to your list yet. You can start by clicking the add location button!'
            : userlist.description}
        </p>
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={(): void => {
            setList(userlist);
            setShowEdit(true);
          }}
        >
          Edit list details
        </Button>
        <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }} onClick={(): void => setShowCreate(true)}>
          Add location
        </Button>
        <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }} onClick={(): void => setShowMap(!showMap)}>
          {showMap ? 'View locations' : 'View map'}
        </Button>
        <hr />
        {!showMap && (
          <LocationList
            locations={userlist.locations}
            location={location}
            setLocation={setLocation}
            defaultview={userlist.defaultview}

          />
        )}
        {showMap && userlist && (
          <ListLocationsMap
            locations={userlist.locations}
            defaultview={userlist.defaultview}
          />
        )}
      </Container>
      <CreateNewLocationModal
        setShow={setShowCreate}
        show={showCreate}
        defaultview={userlist.defaultview}
      />
      <EditListModal
        show={showEdit}
        setShow={setShowEdit}
        list={list}
        setList={setList}
      />
    </>
  );
};

export default ListPage;
