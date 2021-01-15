/* eslint-disable no-console */
import React, { useRef, useEffect } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from '../../../../node_modules/@types/leaflet';
import { MapProps } from './NewEntryTypes';

import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Pin from './Pin';

const MapComponent: React.FC<MapProps> = ({
  setPinPosition, pinPosition, setAddress, address,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();

  console.log('address', address);
  console.log('pinPosition', pinPosition);
  useEffect(() => { mapRef.current.leafletElement.invalidateSize(false); });

  return (
    <div className="mb-4 mx-4">
      <Map
        ref={mapRef}
        center={pinPosition[0] === 0 ? [60.195, 24.92] : [pinPosition[0], pinPosition[1]]}
        zoom={pinPosition[0] === 0 ? 11 : 15}
        scrollWheelZoom
        onclick={(e: LeafletMouseEvent): void => setPinPosition([e.latlng.lat, e.latlng.lng])}
        style={{ height: 500 }}
      >
        <Pin pinPosition={pinPosition} setPinPosition={setPinPosition} setAddress={setAddress} />
        <TileLayer
          noWrap
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    </div>
  );
};

export default MapComponent;
