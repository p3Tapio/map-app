import React, { useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { SingleLocationMapProps } from '../locationsTypes';
import '../../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

const SingleLocationModal: React.FC<SingleLocationMapProps> = ({ location, show, setShow }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  useEffect(() => {
    if (location && mapRef.current) mapRef.current.leafletElement.invalidateSize(false);
  });
  const handleClose = (): void => {
    setShow(false);
  };
  if (!location) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {location.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Map
          ref={mapRef}
          center={[location.coordinates.lat, location.coordinates.lng]}
          zoom={14}
          style={{ height: 400, width: '90w' }}
        >
          <TileLayer
            noWrap
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[location.coordinates.lat, location.coordinates.lng]}
            onMouseOver={(e: LeafletMouseEvent): void => {
              e.target.openPopup();
            }}
            onMouseOut={(e: LeafletMouseEvent): void => {
              e.target.closePopup();
            }}
          >
            <Popup closeButton={false}>
              You can find the
              {' '}
              {location.name}
              {' '}
              here!
            </Popup>
          </Marker>
        </Map>
      </Modal.Body>
    </Modal>
  );
};
export default SingleLocationModal;
