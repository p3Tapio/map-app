import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
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
  const [showCreate, setShowCreate] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showEditList, setShowEditList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [list, setList] = useState(initialList);

  const userlist = useSelector((state: RootStore) => state.lists.userLists?.filter((x: List) => {
    if (x._id === id) return x;
    return undefined;
  }));

  useEffect(() => {
    dispatch(getUserLists());
  }, [dispatch, showCreate, showEditList, showEditLocation, showDelete]);

  if (!userlist) return null;
  if (userlist.length === 0) {
    history.push('/userpage');
    return null;
  }

  return (
    <>
      <Container className="mt-5">
        <h4>{userlist[0].name}</h4>
        <p>
          {(userlist[0].country !== 'unknown' && userlist[0].place !== 'unknown' && `${userlist[0].place}, ${userlist[0].country}`)}
          {(userlist[0].country !== 'unknown' && userlist[0].place === 'unknown' && `${userlist[0].country}`)}
          {(userlist[0].country === 'unknown' && userlist[0].place !== 'unknown' && `${userlist[0].place}`)}
        </p>
        <p>
          {!userlist[0].locations || userlist[0].locations.length === 0
            ? 'Seems like you have not added any locations to your list yet. You can start by clicking the add location button!'
            : userlist[0].description}
        </p>
        <hr />
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={(): void => {
            setList(userlist[0]);
            setShowEditList(true);
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
        <Link to="/userpage">
          <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }}>
            Back to list
          </Button>
        </Link>
        <hr />
        {!showMap && (
          <LocationList
            locations={userlist[0].locations}
            location={location}
            setLocation={setLocation}
            defaultview={userlist[0].defaultview}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
            showEdit={showEditLocation}
            setShowEdit={setShowEditLocation}
          />
        )}
        {showMap && (
          <ListLocationsMap
            locations={userlist[0].locations}
            defaultview={userlist[0].defaultview}
          />
        )}
      </Container>
      {userlist[0].defaultview
        ? (
          <>
            <CreateNewLocationModal
              setShow={setShowCreate}
              show={showCreate}
              defaultview={userlist[0].defaultview}
            />
            <EditListModal
              show={showEditList}
              setShow={setShowEditList}
              list={list}
              setList={setList}
            />
          </>
        )
        : null}
    </>
  );
};

export default ListPage;
