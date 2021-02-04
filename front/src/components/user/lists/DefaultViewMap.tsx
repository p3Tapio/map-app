import React, { useRef, useEffect } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Leaflet, { LeafletEvent } from 'leaflet';
import { DefaultViewMapProps } from './listTypes';

const DefaultViewMap: React.FC<DefaultViewMapProps> = ({ list, setList, validationMsg }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  return (
    <div className="mx-4" style={validationMsg.defaultviewErr ? { marginBottom: '18px' } : { marginBottom: '30px' }}>
      <Map
        ref={mapRef}
        center={[list.defaultview.lat, list.defaultview.lng]}
        maxBoundsViscosity={1.0}
        maxBounds={bounds}
        minZoom={2}
        zoom={list.defaultview.zoom}
        scrollWheelZoom
        style={{ height: 500 }}
        onZoomEnd={(ev: LeafletEvent): void => {
          setList({
            ...list,
            defaultview: {
              ...list.defaultview,
              zoom: ev.target._zoom,
            },
          });
        }}
        onMoveEnd={(ev: LeafletEvent): void => {
          setList({
            ...list,
            defaultview: {
              ...list.defaultview,
              lat: ev.target.getCenter().lat,
              lng: ev.target.getCenter().lng,
            },
          });
        }}
      >
        <TileLayer
          noWrap
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
      { (validationMsg.defaultviewErr && <p className="newLocationError">{validationMsg.defaultviewErr}</p>) }
    </div>
  );
};

export default DefaultViewMap;
