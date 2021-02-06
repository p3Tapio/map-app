import React from 'react'
import { Button,  Card, Col,  Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { ListComponentProps } from './publicListTypes'

const ListComponent: React.FC<ListComponentProps> = ({ list }) => {

  const locations = list.locations.slice(0, 3).map(x => x);
  console.log('locations', locations)

  return (
    <>
      <Card className="mb-2">
        <Row className="no-gutters">
          <Col md={4}>
            <svg className="bd-placeholder-img" width="100%" height="250" xmlns="http://www.w3.org/2000/svg" aria-label="Placeholder: Image" preserveAspectRatio="xMidYMid slice" role="img"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96" /><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Map</text></svg>
          </Col>
          <Col md={8} >
            <Card.Body className="d-flex flex-column" style={{ height: '100%' }}>
              <div style={{ marginLeft: '10px' }}>
                <Card.Title>
                  {list.name}
                </Card.Title>
                <Card.Text>
                  {list.description}
                </Card.Text>
                {locations.map((x) => (
                  <li key={x._id}>{x.name}</li>
                ))}
                {list.locations.length > 3 ? <li>And more, click below for full list ...</li> : null}
              </div>
              <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }} >
                <hr />
                <Row className="justify-content-between" style={{ width: '100%', marginRight: 0 }}>
                  <Col className="text-left" >
                    <Card.Text>
                      {(list.country !== 'unknown' && list.place !== 'unknown' && `${list.place}, ${list.country}`)}
                      {(list.country !== 'unknown' && list.place === 'unknown' && `${list.country}`)}
                      {(list.country === 'unknown' && list.place !== 'unknown' && `${list.place}`)}
                    </Card.Text>
                  </Col>
                  <Col className="text-right">
                    <Link to={`/list/${list._id}`}>
                      <Button variant="outline-dark" size="sm" type="button">
                        Details
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

    </>
  )
}

export default ListComponent
