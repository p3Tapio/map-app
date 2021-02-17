import React, { useEffect, useRef, useState } from 'react';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';
import Leaflet, { LeafletMouseEvent } from 'leaflet';

import { ListLocationsMapProps } from './listTypes';
import { initialLocation } from '../initials';

import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import LocationPopUpModal from '../locations/LocationPopUpModal';

const ListLocationsMap: React.FC<ListLocationsMapProps> = ({ locations, defaultview }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);
  const [location, setLocation] = useState(initialLocation);
  const [showPopUpModal, setShowPopUpModal] = useState(false);

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });
  if (!locations) return null;
  return (
    <>
      <Map
        ref={mapRef}
        center={[defaultview.lat, defaultview.lng]}
        zoom={defaultview.zoom} // TODO -- tämä häikkää päivityksessä: {mapRef.current ? mapRef.current.leafletElement._zoom : defaultview.zoom}
        maxBoundsViscosity={1.0} // asetettu zoomailubugien takia, ilmaantuuko niitä edelleen?
        maxBounds={bounds}
        minZoom={2}
        scrollWheelZoom
        style={{ height: '700px' }}
      >
        <TileLayer
          noWrap
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations && locations[0] && locations[0].coordinates
          ? locations.map((l) => (
            <Marker
              key={l._id}
              position={[l.coordinates.lat, l.coordinates.lng]}
              onMouseOver={(e: LeafletMouseEvent): void => {
                e.target.openPopup();
              }}
              onMouseOut={(e: LeafletMouseEvent): void => {
                e.target.closePopup();
              }}
              onClick={(): void => {
                setLocation(l);
                setShowPopUpModal(true);
              }}
            >
              <Popup closeButton={false}>
                {l.name}
              </Popup>
            </Marker>
          ))
          : <></>}
      </Map>
      <LocationPopUpModal show={showPopUpModal} setShow={setShowPopUpModal} location={location} />
    </>

  );
};

export default ListLocationsMap;
