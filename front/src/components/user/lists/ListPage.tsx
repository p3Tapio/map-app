import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link, useHistory, useParams, useLocation,
} from 'react-router-dom';
import { getUserLists } from '../../../state/reducers/list/listActions';
import { List } from '../../../state/reducers/list/listTypes';
import { RootStore } from '../../../state/store';
import MessageModal from '../../MessageModal';
import { initialList, initialLocation } from '../initials';
import CreateNewLocationModal from '../locations/CreateNewLocationModal';
import LocationList from '../locations/locationList/LocationList';
import EditListModal from './EditListModal';
import ListLocationsMap from './ListLocationsMap';

const ListPage: React.FC = () => {
  const loc = useLocation<{ newList: boolean } | undefined>();
  const dispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showEditList, setShowEditList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [list, setList] = useState(initialList);
  const [showMsgModal, setShowMsgModal] = useState<boolean>(false);
  const [info, setInfo] = useState({ header: 'Success', message: 'New List created!' });

  const userlist = useSelector((state: RootStore) => state.lists.userLists?.filter((x: List) => {
    if (x._id === id) return x;
    return undefined;
  }));

  useEffect(() => {
    dispatch(getUserLists());
  }, [dispatch, showCreateLocation, showEditList, showEditLocation, showDelete]);

  useEffect(() => { if (loc.state) setShowMsgModal(loc.state.newList); }, [loc]);

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
        <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }} onClick={(): void => setShowCreateLocation(true)}>
          Add location
        </Button>
        <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }} onClick={(): void => setShowMap(!showMap)}>
          {showMap ? 'View locations' : 'View map'}
        </Button>
        <Link to="/userpage">
          <Button size="sm" variant="outline-secondary" style={{ marginLeft: '5px' }}>
            Back to lists
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
              setShow={setShowCreateLocation}
              show={showCreateLocation}
              defaultview={userlist[0].defaultview}
              userListLocations={userlist[0].locations}
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
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
    </>
  );
};

export default ListPage;
