import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from '../../state/localStore';
import { toggleFavorite } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import ListComponent from '../public/ListComponent';

const UserFavoriteLists: React.FC = () => {
  const user = getUser();
  const dispatch = useDispatch();
  const lists = useSelector((state: RootStore) => state.lists.publicLists);
  const [favs, setFavs] = useState<List[] | undefined>(lists?.filter((l) => user.favorites.includes(l._id)));

  const handleToggleFavorite = (listId: string): void => { // TODO try-catch?
    dispatch(toggleFavorite(listId));
    setFavs(favs?.filter((x) => x._id !== listId));
  };

  return (
    <div>
      {favs && favs.length !== 0
        ? favs.map((x) => (
          <ListComponent list={x} key={x._id} toggleFavorite={handleToggleFavorite} fromWhere="favorites" />
        ))
        : (
          <>
            <p>
              Looks like you have not favorited any lists yet ....
              <br />
              You can favorite one by navigating to the
              {' '}
              <Link to="/public" style={{ color: 'black', fontWeight: 'bold' }}>location lists</Link>
              {' '}
              and clicking the heart icon!
            </p>
          </>
        )}
    </div>
  );
};

export default UserFavoriteLists;
