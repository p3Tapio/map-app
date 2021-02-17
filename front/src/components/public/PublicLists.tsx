import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container, Dropdown, Row
} from 'react-bootstrap';
import { List as ListIcon, Map } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicLists, toggleFavorite } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import ListComponent from './ListComponent';
import PaginatePublicLists from './PaginatePublicLists';
import PublicListMap from './PublicListMap';

const PublicLists: React.FC = () => {
  const publicLists = useSelector((state: RootStore) => state.lists.publicLists);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
  const [filteredList, setFilteredList] = useState<List[] | undefined>(publicLists);
  const [showMap, setShowMap] = useState(false);
  const [listsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch])
  useEffect(() => {
    !countryFilter ? setFilteredList(publicLists)
      : setFilteredList(publicLists?.filter((l) => l.country === countryFilter))
  }, [countryFilter, publicLists])

  useEffect(() => {
    setCurrentPage(1);
    setActive(1);
  }, [countryFilter])

  const handleToggleFavorite = (listId: string): void => { // TODO try-catch?
    dispatch(toggleFavorite(listId));
  }

  if (!filteredList || !publicLists) return null;

  const countries = Array.from(new Set(publicLists.map((l: List) => l.country)))
  countries.sort((a, b) => a.localeCompare(b));

  const indexOfLast = currentPage * listsPerPage;
  const indexOfFirst = indexOfLast - listsPerPage;
  const currentList = filteredList.slice(indexOfFirst, indexOfLast);
                        
  return (
    <Container className="mt-5">
      <h4>Public location lists</h4>
      <Col>
        <Row>
          <Button
            variant="outline-secondary"
            size="sm"
            className="m-1"
            onClick={() => {
              setShowMap(!showMap);
              setCountryFilter(undefined);
              setCurrentPage(1);
            }}
          >
            {showMap ?
              <>
                <ListIcon size={20} style={{ marginRight: '5px' }} />
                View as list
              </>
              :
              <>
                <Map size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                View on map
              </>}
          </Button>
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              className="m-1"
            >
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
        </Row>
      </Col>
      <hr />
      {showMap
        ? <PublicListMap lists={filteredList} />
        : <>
          {currentList && currentList.map((list) => (
            <ListComponent list={list} key={list._id} toggleFavorite={handleToggleFavorite} fromWhere="public" />
          ))}
          {listsPerPage <= filteredList.length &&
            < PaginatePublicLists
              listsPerPage={listsPerPage}
              totalLists={filteredList.length}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setActive={setActive}
              active={active}
            />
          }
        </>}
    </Container>
  )
};

export default PublicLists;

