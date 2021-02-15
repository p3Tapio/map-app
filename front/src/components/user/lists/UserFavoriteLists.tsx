import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../state/localStore';
import { getPublicLists } from '../../../state/reducers/list/listActions';
import { List } from '../../../state/reducers/list/listTypes';
import { RootStore } from '../../../state/store';
import ListComponent from '../../public/ListComponent';

const UserFavoriteLists: React.FC = () => {
  const user = getUser();
  const dispatch = useDispatch();
  const lists = useSelector((state: RootStore) => state.lists.publicLists);
  const [favs, setFavs] = useState<List[] | undefined>();

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('useEffect');
    setFavs(lists?.filter((l) => user.favorites.includes(l._id)));
  }, [lists]);// dep puuttuu, mutta ikiluuppi

  const toggleFavorite = (listId: string): void => {
    // Tämä tässä kaatuu: RangeError: Maximum call stack size exceeded
    dispatch(toggleFavorite(listId));
    // eslint-disable-next-line no-console
    console.log('listId', listId);
  };

  return (
    <div>
      {favs && favs.length !== 0
        ? favs.map((x) => (
          <ListComponent list={x} key={x._id} toggleFavorite={toggleFavorite} />
        ))
        : (
          <>
            <p>
              Looks like you have not favorited any lists ....
              <br />
              You can favorite one by navigating to the location lists and clicking the heart icon!
            </p>
          </>
        )}
    </div>
  );
};

export default UserFavoriteLists;
