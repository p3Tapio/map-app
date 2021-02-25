import React, { useRef, useEffect, useState } from 'react';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';

import '../../style/mapstyle.css';
import '../../../node_modules/leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import '../../../node_modules/leaflet-defaulticon-compatibility';

import Leaflet, { LeafletMouseEvent } from 'leaflet';
import { Link } from 'react-router-dom';
import { clearTimeout, setTimeout } from 'timers';
import { PublicListMapProps } from './publicListTypes';
import useContainerWidth from '../../hooks/useContainerWidth';

const PublicListMap: React.FC<PublicListMapProps> = ({ lists, mapView }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>();
  const containerWidth = useContainerWidth();
  const southWest = Leaflet.latLng(-89.98155760646617, -180);
  const northEast = Leaflet.latLng(89.99346179538875, 180);
  const bounds = Leaflet.latLngBounds(southWest, northEast);
  const [center, setCenter] = useState([40, 10]);
  const [zoom, setZoom] = useState(1.5);
  let timer: ReturnType<typeof setTimeout>;

  useEffect(() => { mapRef.current.leafletElement.invalidateSize(false); });

  useEffect(() => {
    if (mapView === 'World') {
      setCenter([40, 10]);
      setZoom(1.5);
    } else if (mapView === 'Africa') {
      setCenter([1, 18]);
      setZoom(3.4);
    } else if (mapView === 'Australia') {
      setCenter([-30, 145]);
      setZoom(3.5);
    } else if (mapView === 'Asia') {
      setCenter([30, 110]);
      setZoom(3.3);
    } else if (mapView === 'Europe') {
      setCenter([55, 18]);
      setZoom(3.49);
    } else if (mapView === 'North and Central America') {
      setCenter([50, -95]);
      setZoom(3.49);
    } else if (mapView === 'South America') {
      setCenter([-25, -65]);
      setZoom(3.49);
    }
  }, [mapView]);

  const timeout = (e: LeafletMouseEvent): void => {
    timer = setTimeout(() => { e.target.closePopup(); }, 1000);
  };
  const restartTimeout = (): void => clearTimeout(timer);

  return (
    <Map
      ref={mapRef}
      center={[center[0], center[1]]}
      maxBoundsViscosity={1.0}
      maxBounds={bounds}
      minZoom={1.5}
      zoom={zoom}
      scrollWheelZoom
      style={containerWidth && containerWidth.width < 960
        ? { height: containerWidth.width / 1.5, width: containerWidth.width }
        : { height: 640, width: 960 }}
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
