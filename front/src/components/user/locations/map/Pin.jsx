import React, { useEffect } from 'react';
import * as ELG from 'esri-leaflet-geocoder';
import { Marker } from 'react-leaflet';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Pin = ({ location, setAddress }) => {
  useEffect(() => {
    if (location.coordinates.lat !== 0) {
      ELG.reverseGeocode().latlng([location.coordinates.lat, location.coordinates.lng]).run((err, results) => {
        if (results) {
          setAddress(results.address.LongLabel);
          // eslint-disable-next-line no-console
        } else console.log('err', err);
      });
    }
  }, [setAddress, location.coordinates]);
  return location.coordinates && <Marker key={location.coordinates.lat} position={location.coordinates} interactive={false} />;
};
export default Pin;
