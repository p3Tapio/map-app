import React, { useEffect } from "react";
import { Marker } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Pin = ({ location, setAddress }) => {
  useEffect(() => {
    if (location.coordinates.lat !== 0) {
      (async () => {
        try {
          const locationIqToken = process.env.LOCATIONIQ_TOKEN;
          // TODO move this to backend call to avoid exposing token
          const response = await axios.get(
            `https://us1.locationiq.com/v1/reverse?key=${locationIqToken}&lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&format=json`
          );
          const { data } = response;
          const { display_name } = data;
          setAddress(display_name);
        } catch (error) {
          console.error("error", error);
        }
      })();
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
