import React, { useRef, useEffect } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { MapProps } from '../locationsTypes';

import '../../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Pin from './Pin';

const MapComponent: React.FC<MapProps> = ({
  location, setLocation, validationMsg, setAddress,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  return (
    <div className="mx-4" style={validationMsg.coordinatesErr ? { marginBottom: '18px' } : { marginBottom: '30px' }}>
      <Map
        ref={mapRef}
        center={location.coordinates.lat === 0 ? [60.195, 24.92] : [location.coordinates.lat, location.coordinates.lng]}
        // eslint-disable-next-line no-nested-ternary
        zoom={location.coordinates.lat === 0 ? 11 : mapRef.current ? mapRef.current.leafletElement._zoom : 15}
        scrollWheelZoom
        onclick={(e: LeafletMouseEvent): void => {
          setLocation({
            ...location,
            coordinates: {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
            },
          });
        }}
        style={{ height: 500 }}
      >
        <Pin location={location} setAddress={setAddress} />
        <TileLayer
          noWrap
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
      {(validationMsg.coordinatesErr && <p className="newLocationError">{validationMsg.coordinatesErr}</p>)}
    </div>
  );
};

export default MapComponent;
