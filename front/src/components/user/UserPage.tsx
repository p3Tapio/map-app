import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Heart, List as ListIcon, Plus } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../state/localStore';
import { getPublicLists, getUserLists } from '../../state/reducers/list/listActions';
import { RootStore } from '../../state/store';
import { initialList } from '../initials';
import CreateNewListModal from '../lists/CreateNewListModal';
import ListList from '../lists/ListList';
import UserFavoriteLists from '../lists/UserFavoriteLists';

const UserPage: React.FC = () => {
  const user = getUser();
  const dispatch = useDispatch();
  const userLists = useSelector((state: RootStore) => state.lists.userLists);

  const [showCreateList, setShowCreateList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newList, setNewList] = useState(initialList);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    dispatch(getUserLists());
    dispatch(getPublicLists());
  }, [dispatch, showDelete, showEdit]);

  const createNewList = (): void => {
    setNewList(initialList);
    setShowCreateList(true);
  };

  if (!user) return null;
  return (
    <>
      <Container className="mt-5">
        <h4>
          Hi,
          {' '}
          {user.username}
          !
        </h4>
        <p>
          {!userLists || userLists.length === 0
            ? 'Seems like you have not created any location lists yet. You can start by clicking the create new button!'
            : ' Below you can see the lists you have created. If you wish to edit them, first click the name of the list and then the edit button.'
            + 'You can create a new one by clicking the create new button below!'}
        </p>
        <Button id="createList" onClick={createNewList} size="sm" variant="outline-secondary" style={{ paddingRight: '10px' }}>
          Create new list
          <Plus size={24} style={{ marginLeft: '10px' }} />
        </Button>
        {showFavorites
          ? (
            <Button
              size="sm"
              variant="outline-secondary"
              style={{ paddingRight: '10px', marginLeft: '5px' }}
              onClick={(): void => setShowFavorites(!showFavorites)}
            >
              See your lists
              <ListIcon size={24} style={{ marginLeft: '10px' }} />
            </Button>
          )
          : (
            <Button
              size="sm"
              variant="outline-secondary"
              style={{ paddingRight: '10px', marginLeft: '5px' }}
              onClick={(): void => setShowFavorites(!showFavorites)}
            >
              See your favorites
              <Heart size={24} style={{ marginLeft: '10px' }} />
            </Button>
          )}
        <hr />
        {showFavorites
          ? <UserFavoriteLists />
          : (
            <ListList
              userLists={userLists}
              showDelete={showDelete}
              setShowDelete={setShowDelete}
              showEdit={showEdit}
              setShowEdit={setShowEdit}
            />
          )}
      </Container>
      <CreateNewListModal
        show={showCreateList}
        setShow={setShowCreateList}
        list={newList}
        setList={setNewList}
      />
    </>
  );
};

export default UserPage;
