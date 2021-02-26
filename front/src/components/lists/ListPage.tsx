import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  Link, useHistory, useParams, useLocation,
} from 'react-router-dom';
import { Button, Container, Row } from 'react-bootstrap';
import {
  ArrowLeftShort, Pen, Plus, List as ListIcon, Map,
} from 'react-bootstrap-icons';
import { getUserLists } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import MessageModal from '../MessageModal';
import { initialList, initialLocation } from '../initials';
import CreateNewLocationModal from '../locations/CreateNewLocationModal';
import LocationList from '../locations/locationList/LocationList';
import EditListModal from './EditListModal';
import ListLocationsMap from './ListLocationsMap';
import CommentsContainer from '../Comments/CommentsContainer';

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
        <Row className="d-flex justify-content-center ">
          <Link to="/userpage" className="m-1">
            <Button size="sm" variant="outline-secondary">
              <ArrowLeftShort size={20} />
              Back to lists
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline-secondary"
            className="m-1"
            onClick={(): void => {
              setList(userlist[0]);
              setShowEditList(true);
            }}
          >
            <Pen size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
            Edit list details
          </Button>
          <Button size="sm" variant="outline-secondary" className="m-1" onClick={(): void => setShowCreateLocation(true)}>
            <Plus size={20} />
            Add location
          </Button>
          <Button size="sm" variant="outline-secondary" className="m-1" onClick={(): void => setShowMap(!showMap)}>
            {showMap
              ? (
                <>
                  <ListIcon size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                  View locations
                </>
              )
              : (
                <>
                  <Map size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                  View map
                </>
              )}
          </Button>
        </Row>
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
        <hr />
        <CommentsContainer
          listId={id}
          createdBy={userlist[0].createdBy._id}
          publicListView={false}
        />
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
