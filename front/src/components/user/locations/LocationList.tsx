import React, { useState } from 'react';
import { Container, Card, Col } from 'react-bootstrap';
import { Location } from '../../../state/reducers/location/locationTypes';
import SingleLocationMap from './SingleLocationMap';

const LocationList: React.FC<{ locations: Location[] | undefined }> = ({ locations }) => {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [show, setShow] = useState(false);

  if (!locations) return null;
  return (
    <>
      <Container>
        <Col>
          {locations.map((x) => (
            <Card style={{ width: '18rem' }} key={x._id}>
              <Card.Header>
                {x.name}
              </Card.Header>
              <Card.Img variant="top" src={x.imageLink} />
              <Card.Body>
                <Card.Text>
                  {x.description}
                </Card.Text>
              </Card.Body>
              <Card.Footer style={{ lineHeight: 1 }}>
              <small>
                  {x.address}
                </small>
                <hr />
                <Col className="text-right">
                  <p className="authFormInfo" style={{ marginRight: '-20px' }}>
                    Want to view it on map?
                  </p>
                  <button
                    type="button"
                    className="locationCardBtn"
                    onClick={(): void => {
                      setLocation(x);
                      setShow(true);
                    }}
                  >
                    Click here!
                  </button>
                </Col>
              </Card.Footer>
            </Card>
          ))}
        </Col>
      </Container>
      <SingleLocationMap location={location} show={show} setShow={setShow} />
    </>
  );
};

export default LocationList;
