import React, { useEffect, useRef } from 'react';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';
import Leaflet, { LeafletMouseEvent } from 'leaflet';

import { ListLocationsMapProps } from './listTypes';

import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

const ListLocationsMap: React.FC<ListLocationsMapProps> = ({ locations, defaultview }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  return (
    <div>
      <Map
        ref={mapRef}
        center={[defaultview.lat, defaultview.lng]}
        zoom={mapRef.current ? mapRef.current.leafletElement._zoom : defaultview.zoom}
        maxBoundsViscosity={1.0}
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
        {locations
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
            >
              <Popup>
                {l.name}
              </Popup>
            </Marker>
          ))
          : null}
      </Map>
    </div>
  );
};

export default ListLocationsMap;
