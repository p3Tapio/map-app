import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserLists } from '../../../state/reducers/list/listActions';
import { RootStore } from '../../../state/store';

const ListList: React.FC = () => {
  const dispatch = useDispatch();
  const userLists = useSelector((state: RootStore) => state.lists.userLists);
  useEffect(() => {
    dispatch(getUserLists());
  }, [dispatch]);
  return (
    <div>
      <>
        {userLists
          ? userLists.map((l) => (
            <Link key={l._id} to={`/list/${l._id}`}>{l.name}</Link>
          ))
          : null}
      </>
    </div>
  );
};

export default ListList;
