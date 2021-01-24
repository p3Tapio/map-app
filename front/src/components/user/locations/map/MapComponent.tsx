import React, { useRef, useEffect, useState } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { MapProps } from '../locationsTypes';

import '../../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Pin from './Pin';

const MapComponent: React.FC<MapProps> = ({
  setPinPosition, pinPosition, setAddress, validationMsg,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });
  console.log('pinPosition', pinPosition)
  return (
    <div className="mx-4" style={validationMsg.coordinatesErr ? { marginBottom: '18px' } : { marginBottom: '30px' }}>
      <Map
        ref={mapRef}
        center={pinPosition[0] === 0 ? [60.195, 24.92] : [pinPosition[0], pinPosition[1]]}
        zoom={pinPosition[0] === 0
          // eslint-disable-next-line no-underscore-dangle
          ? 11 :  mapRef.current ? mapRef.current.leafletElement._zoom : 15} 
        scrollWheelZoom
        onclick={(e: LeafletMouseEvent): void => {
          setPinPosition([e.latlng.lat, e.latlng.lng]);
        }}
        style={{ height: 500 }}
      >
        <Pin pinPosition={pinPosition} setPinPosition={setPinPosition} setAddress={setAddress} />
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
