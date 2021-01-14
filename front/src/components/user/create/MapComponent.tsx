import React, { useState, useRef, useEffect } from 'react'

import { Map, TileLayer } from 'react-leaflet';

import '../../../style/mapstyle.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import Pin from './Pin';


const MapComponent: React.FC = () => {
  const mapRef = useRef<any>();
  const [pinPosition, setPinPosition] = useState([0, 0]);
  const [address, setAddress] = useState('');
  console.log('address', address)
  console.log('pinPosition', pinPosition)
  useEffect(() => { mapRef.current.leafletElement.invalidateSize(false); })

  return (
    <div className="mb-4 mx-4">
      <Map
        ref={mapRef}
        center={[60.195, 24.92]} 
        zoom={pinPosition[0] === 0 ? 11 : 18}
        scrollWheelZoom={true}
        onclick={(e) => setPinPosition([e.latlng.lat, e.latlng.lng])}
        style={{ height: 500, }}
      >
        <Pin pinPosition={pinPosition} setPinPosition={setPinPosition} setAddress={setAddress} />
        <TileLayer
          noWrap={true}
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    </div>
  )
}

export default MapComponent;
