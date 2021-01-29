import React, { useRef, useEffect } from 'react';
import { Map, TileLayer } from 'react-leaflet';

import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Leaflet, { LeafletEvent } from 'leaflet';
import { DefaultViewMapProps } from './listTypes';

const DefaultViewMap: React.FC<DefaultViewMapProps> = ({ newList, setNewList }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  return (
    <div className="mx-4" style={{ marginBottom: '30px' }}>
      <Map
        ref={mapRef}
        center={[newList.defaultview.lat, newList.defaultview.lng]}
        maxBoundsViscosity={1.0}
        maxBounds={bounds}
        zoom={newList.defaultview.zoom}
        scrollWheelZoom
        style={{ height: 500 }}
        onZoomEnd={(ev: LeafletEvent): void => {
          setNewList({
            ...newList,
            defaultview: {
              ...newList.defaultview,
              zoom: ev.target._zoom,
            },
          });
        }}
        onMoveEnd={(ev: LeafletEvent): void => {
          setNewList({
            ...newList,
            defaultview: {
              ...newList.defaultview,
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
      {/* { (validationMsg.coordinatesErr && <p className="newLocationError">{validationMsg.coordinatesErr}</p>) } */}
    </div>
  );
};

export default DefaultViewMap;
