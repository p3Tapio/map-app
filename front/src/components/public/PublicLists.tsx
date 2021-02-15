import React, { useEffect, useState } from 'react';
import {
  Container, Dropdown
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicLists, toggleFavorite } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import ListComponent from './ListComponent';


const PublicLists: React.FC = () => {
  const publicLists = useSelector((state: RootStore) => state.lists.publicLists);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
  const [filteredList, setFilteredList] = useState<List[] | undefined>(publicLists);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch])
  useEffect(() => {
    !countryFilter ? setFilteredList(publicLists)
      : setFilteredList(publicLists?.filter((l) => l.country === countryFilter))
  }, [countryFilter, publicLists])

  const handleToggleFavorite = (listId: string): void => { // TODO try-catch?
    dispatch(toggleFavorite(listId));
  }

  if (!publicLists) return null;

  const countries = Array.from(new Set(publicLists.map((l: List) => l.country)))
  countries.sort((a, b) => a.localeCompare(b));

  return (
    <Container className="mt-5">
      <h4>Public location lists</h4>
      {/* TODO  paginoinnint */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          Filter by country
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setCountryFilter(undefined)}>All</Dropdown.Item>
          {countries.map((c, i) => (
            <Dropdown.Item
              key={i}
              onClick={() => setCountryFilter(c)}
            >
              {c}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <hr />
      {filteredList && filteredList.map((list) => (
        <ListComponent list={list} key={list._id} toggleFavorite={handleToggleFavorite} fromWhere="public" />
      ))}
    </Container>
  )
};

export default PublicLists;
