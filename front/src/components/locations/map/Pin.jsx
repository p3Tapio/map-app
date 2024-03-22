import React, { useEffect } from "react";
import * as ELG from "esri-leaflet-geocoder";
import { Marker } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

/*
TODO

Need to replace ELG with something for reverseGeocode 
or get token?

*/

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Pin = ({ location, setAddress }) => {
  useEffect(() => {
    if (location.coordinates.lat !== 0) {
      ELG.reverseGeocode()
        .latlng([location.coordinates.lat, location.coordinates.lng])
        .run((err, results) => {
          if (results) {
            setAddress(results.address.LongLabel);
            // eslint-disable-next-line no-console
          } else console.log("err", err);
        });
    }
  }, [setAddress, location.coordinates]);

  return (
    location.coordinates && (
      <Marker
        key={location.coordinates.lat}
        position={location.coordinates}
        interactive={false}
      />
    )
  );
};
export default Pin;
