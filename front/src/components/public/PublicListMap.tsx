import React, { useRef, useEffect } from 'react';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import '../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import Leaflet, { LeafletMouseEvent } from 'leaflet';
import { Link } from 'react-router-dom';
import { clearTimeout, setTimeout } from 'timers';
import { PublicListMapProps } from './publicListTypes';

const PublicListMap: React.FC<PublicListMapProps> = ({ lists }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);
  let timer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(false);
  });

  const timeout = (e: LeafletMouseEvent): void => {
    timer = setTimeout(() => { e.target.closePopup(); }, 1000);
  };
  const restartTimeout = (): void => clearTimeout(timer);

  return (
    <Map
      ref={mapRef}
      center={[35, 10]}
      maxBoundsViscosity={1.0}
      maxBounds={bounds}
      minZoom={1.5}
      zoom={1.5}
      scrollWheelZoom
      style={{ height: 500 }}
    >
      {lists && lists.length !== 0
        && lists.map((x) => (
          <Marker
            key={x._id}
            position={[x.defaultview.lat, x.defaultview.lng]}
            onMouseOver={(e: LeafletMouseEvent): void => {
              e.target.openPopup();
            }}
            onMouseOut={(e: LeafletMouseEvent): void => {
              restartTimeout();
              timeout(e);
            }}
          >
            <Popup closeButton={false}>
              {x.name}
              <br />
              <Link to={`/public/${x._id}`}>
                Click for details
              </Link>
            </Popup>
          </Marker>
        ))}
      <TileLayer
        noWrap
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </Map>
  );
};

export default PublicListMap;