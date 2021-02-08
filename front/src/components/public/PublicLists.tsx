import React, { useEffect } from 'react';
import {
  Container,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicLists } from '../../state/reducers/list/listActions';
import { RootStore } from '../../state/store';
import ListComponent from './ListComponent';


const PublicLists: React.FC = () => {
  const publicLists = useSelector((state: RootStore) => state.lists.publicLists);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPublicLists());
  }, [])

  if (!publicLists) return null;
  return (
    <Container className="mt-5">
      <h4>Public location lists</h4>
      {/* TODO country dropdown, paginoinnint tms */}
      <hr />
      {publicLists.map((list) => (
        <ListComponent list={list} key={list._id} />
      ))}
    </Container>
  )
};

export default PublicLists;
