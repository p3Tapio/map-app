import axios from 'axios';
import React, { SetStateAction, useEffect, useState } from 'react';
import {
  Button, Col, Container, Dropdown, Row,
} from 'react-bootstrap';
import { ArrowLeftShort, List as ListIcon, Map } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Location } from '../../state/services/locationTypes';
import { getPublicLists } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import { initialLocation } from '../initials';
import ListLocationsMap from '../lists/ListLocationsMap';
import LocationCard from '../locations/locationList/LocationCard';
import SingleLocationMap from '../locations/locationList/SingleLocationMap';
import ListComments from '../Comments/CommentsContainer';

const PublicListDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const loc = useLocation<{ from: string | undefined }>();
  const publiclist = useSelector((state: RootStore) => state.lists.publicLists?.find((x: List) => x._id === id));
  const dispatch = useDispatch();
  const [countryDetails, setCountryDetails] = useState([{ name: '', flag: '' }]);
  const [showMapComponent, setShowMapComponent] = useState(true);
  const [showLittleMap, setShowLittleMap] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [filteredLocations, setFilteredLocations] = useState<Location[] | undefined>(undefined);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch]);
  useEffect(() => {
    if (publiclist && publiclist.country !== 'unknown') {
      axios.get(`https://restcountries.eu/rest/v2/name/${publiclist.country}`).then((res) => {
        setCountryDetails(res.data);
      });
    }
  }, [publiclist]);
  useEffect(() => {
    if (publiclist) {
      if (!categoryFilter) setFilteredLocations(publiclist.locations);
      else setFilteredLocations(publiclist.locations.filter((l) => l.category === categoryFilter));
    }
  }, [categoryFilter, publiclist]);

  if (!publiclist || !filteredLocations) return null;

  const categories = Array.from(new Set(publiclist.locations.map((x) => x.category)));
  categories.sort((a, b) => a.localeCompare(b));

  return (
    <Container className="mt-5">
      <HeaderElement
        countryDetails={countryDetails}
        publiclist={publiclist}
        showMapComponent={showMapComponent}
        setShowMapComponent={setShowMapComponent}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        loc={loc.state ? loc.state.from : undefined}
      />
      <hr />
      {showMapComponent
        ? <ListLocationsMap locations={filteredLocations} defaultview={publiclist.defaultview} />
        : (
          <>
            <Col className="justify-content-center locationCardGrid">
              {filteredLocations.map((x) => (
                <LocationCard
                  key={x._id}
                  type="public"
                  location={x}
                  setShowMap={setShowLittleMap}
                  setLocation={setLocation}
                />
              ))}
            </Col>
            <SingleLocationMap location={location} show={showLittleMap} setShow={setShowLittleMap} />
          </>
        )}
      <hr />
      <ListComments listId={id} createdBy={publiclist.createdBy._id}/>
    </Container>
  );
};

const HeaderElement: React.FC<{
  countryDetails: { name: string; flag: string }[];
  publiclist: List;
  showMapComponent: boolean;
  setShowMapComponent: React.Dispatch<SetStateAction<boolean>>;
  setCategoryFilter: React.Dispatch<SetStateAction<string | undefined>>;
  categories: string[];
  loc: string | undefined;
}> = ({
  countryDetails, publiclist, showMapComponent, setShowMapComponent, setCategoryFilter, categories, loc,
}) => (
  <Row className="mb-4">
    <Col md={2} xs={4} className="mt-2">
      {countryDetails[0].flag !== ''
        ? <img src={countryDetails[0].flag} alt="Flag" height="50" style={{ border: '1px solid black' }} />
        : null}
      <br />
      {(publiclist.country !== 'unknown' && publiclist.place !== 'unknown' && (
        <small className="mt-1">
          {publiclist.place}
          ,
          {' '}
          {publiclist.country}
        </small>
      ))}
      {(publiclist.country !== 'unknown' && publiclist.place === 'unknown' && <small className="mt-1">{publiclist.country}</small>)}
      {(publiclist.country === 'unknown' && publiclist.place !== 'unknown' && <small className="mt-1">{publiclist.place}</small>)}
    </Col>
    <Col md={10} xs={8}>
      <h4>{publiclist.name}</h4>
      <p>{publiclist.description}</p>
      <Row>
        <Link to={!loc || loc === 'public' ? '/public' : '/userpage'}>
          <Button
            className="m-1 pr-3"
            variant="outline-dark"
            size="sm"
            type="button"
          >
            <ArrowLeftShort size={20} />
            Back
          </Button>
        </Link>
        <Button
          variant="outline-dark"
          size="sm"
          type="button"
          className="m-1 pr-3"
          onClick={(): void => {
            setShowMapComponent(!showMapComponent);
            setCategoryFilter(undefined);
          }}
        >
          {showMapComponent
            ? (
              <>
                <ListIcon size={20} style={{ marginRight: '5px' }} />
                View as list
              </>
            )
            : (
              <>
                <Map size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                View on map
              </>
            )}
        </Button>
        <Dropdown className="m-1">
          <Dropdown.Toggle size="sm" variant="outline-dark" style={{ fontSize: '14px' }}>
            Filter by category
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={(): void => setCategoryFilter(undefined)}>All</Dropdown.Item>
            {categories.map((c) => (
              <Dropdown.Item key={c} onClick={(): void => setCategoryFilter(c)}>
                {c === 'museumArt' && 'Museums & Art'}
                {c === 'shopping' && 'Shopping'}
                {c === 'sights' && 'Sights'}
                {c === 'foodDrink' && 'Food & Drink'}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    </Col>
  </Row>
);

export default PublicListDetails;
