import React, { useEffect } from 'react';
import * as ELG from 'esri-leaflet-geocoder';
import { Marker } from 'react-leaflet';

// TODO reverseGeocodesta puuttuu tyypitykset ?? :(
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Pin = ({ pinPosition, setPinPosition, setAddress }) => {
  useEffect(() => {
    if (pinPosition[0] !== 0) {
      ELG.reverseGeocode().latlng(pinPosition).run((err, results) => {
        if (results) {
          setAddress(results.address.LongLabel);
          // eslint-disable-next-line no-console
        } else console.log('err', err);
      });
    }
  }, [pinPosition, setPinPosition, setAddress]);
  return pinPosition && <Marker key={pinPosition[0]} position={pinPosition} interactive={false} />;
};
export default Pin;
