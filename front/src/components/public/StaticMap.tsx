import React from 'react'

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { StaticMapProps } from './publicListTypes';
import { LeafletMouseEvent } from 'leaflet';


const StaticMap: React.FC<StaticMapProps> = ({ list }) => {
  if (!list) return null;
  return (
    <Map
      style={{ height: '100%', width: '100%' }}
      zoom={list.defaultview.zoom - 1}
      center={[list.defaultview.lat, list.defaultview.lng]}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      closePopupOnClick={false}
      dragging={false}
      trackResize={false}
      touchZoom={false}
      zoomControl={false}
    >
      { list && list.locations ? list.locations.map((x) => (
        <Marker
          key={x._id}
          position={[x.coordinates.lat, x.coordinates.lng]}
          onMouseOver={(e: LeafletMouseEvent): void => {
            e.target.openPopup();
          }}
          onMouseOut={(e: LeafletMouseEvent): void => {
            e.target.closePopup();
          }}>
          <Popup>
            {x.name}
          </Popup>
        </Marker>
      )) : null
      }
      <TileLayer
        noWrap
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </Map >
  )
}

export default StaticMap;

