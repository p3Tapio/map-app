import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../state/localStore';
import { getUserLists } from '../../state/reducers/list/listActions';
import { RootStore } from '../../state/store';
import { initialList } from './initials';
import CreateNewListModal from './lists/CreateNewListModal';
import ListList from './lists/ListList';

const UserPage: React.FC = () => {
  const user = getUser();
  const dispatch = useDispatch();
  const userLists = useSelector((state: RootStore) => state.lists.userLists);

  const [showCreateList, setShowCreateList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [newList, setNewList] = useState(initialList);

  useEffect(() => {
    dispatch(getUserLists());
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
        </h4>
        <p>
          {!userLists || userLists.length === 0
            ? 'Seems like you have not created any location lists yet. You can start by clicking the create new button!'
            : ' Below you can see the lists you have created. You can create a new one by clicking the create new button!'}
        </p>
        <Button onClick={createNewList} size="sm" variant="outline-secondary">Create New</Button>
        <hr />
        <ListList
          userLists={userLists}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          showEdit={showEdit}
          setShowEdit={setShowEdit}
        />
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
