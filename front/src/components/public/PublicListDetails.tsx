import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getPublicLists } from '../../state/reducers/list/listActions';
import { List } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import { initialLocation } from '../user/initials';
import ListLocationsMap from '../user/lists/ListLocationsMap';
import LocationCard from '../user/locations/locationList/LocationCard';
import SingleLocationMap from '../user/locations/locationList/SingleLocationMap';

const PublicListDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const publiclist = useSelector((state: RootStore) => state.lists.publicLists?.find((x: List) => x._id === id));
  const dispatch = useDispatch();
  const [countryDetails, setCountryDetails] = useState([{ name: '', flag: '' }]);
  const [showMapComponent, setShowMapComponent] = useState(true);
  const [showLittleMap, setShowLittleMap] = useState(false);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => { dispatch(getPublicLists()); }, [dispatch])
  useEffect(() => {
    if (publiclist && publiclist.country !== 'unknown') axios.get(`https://restcountries.eu/rest/v2/name/${publiclist.country}`).then(res => {
      setCountryDetails(res.data);
    })
  }, [publiclist])

  if (!publiclist) return null;

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={2} xs={4} className="mt-2">
          {countryDetails[0].flag !== ''
            ? <img src={countryDetails[0].flag} alt="Flag" height="50" style={{ border: "1px solid black" }} />
            : null}
          <br />
          {(publiclist.country !== 'unknown' && publiclist.place !== 'unknown' && <small className="mt-1">{publiclist.place},{' '}{publiclist.country}</small>)}
          {(publiclist.country !== 'unknown' && publiclist.place === 'unknown' && <small className="mt-1">{publiclist.country}</small>)}
          {(publiclist.country === 'unknown' && publiclist.place !== 'unknown' && <small className="mt-1">{publiclist.place}</small>)}
        </Col>
        <Col md={10} xs={8}>
          <h4>{publiclist.name}</h4>
          <p>{publiclist.description}</p>
          <Button
            variant="outline-dark"
            size="sm"
            type="button"
            style={{ marginRight: '5px' }}
            onClick={(): void => setShowMapComponent(!showMapComponent)}>
            {showMapComponent ? 'View as list' : 'View on map'}
          </Button>
          <Link to="/public">
            <Button
              variant="outline-dark"
              size="sm"
              type="button"
            >
              Back
            </Button>
          </Link>
        </Col>
      </Row>
      <hr />
      {showMapComponent
        ? <ListLocationsMap locations={publiclist.locations} defaultview={publiclist.defaultview} />
        : <>
          <Col className="row justify-content-center locationCardGrid">
            {publiclist.locations.map((x) => (
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
      }
    </Container>
  )
}

export default PublicListDetails
