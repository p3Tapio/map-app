import React, { useRef, useEffect } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import Leaflet, { LeafletMouseEvent } from 'leaflet';
import { MapProps } from '../locationsTypes';

import '../../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Pin from './Pin';

const MapComponent: React.FC<MapProps> = ({
  location, setLocation, validationMsg, setAddress, defaultview,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);
  const zoom = location.coordinates.lat === 0 ? defaultview.zoom : 11;
  const lat = location.coordinates.lat === 0 ? defaultview.lat : location.coordinates.lat;
  const lng = location.coordinates.lng === 0 ? defaultview.lng : location.coordinates.lng;

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  return (
    <div className="mx-4" style={validationMsg.coordinatesErr ? { marginBottom: '18px' } : { marginBottom: '30px' }}>
      <Map
        ref={mapRef}
        center={[lat, lng]}
        zoom={mapRef.current ? mapRef.current.leafletElement._zoom : zoom}
        maxBoundsViscosity={1.0}
        maxBounds={bounds}
        minZoom={2}
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
