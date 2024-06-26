import React, { useEffect } from "react";
import { Marker } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import externalsService from "../../../state/services/externalsService";
import { createConfig } from "../../../state/localStore";
const baseUrl = process.env.APP_URL;

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
          const { coordinates } = location;
          const response = await externalsService.getAddress(
            coordinates.lat,
            coordinates.lng
          );
          const { data } = response;
          const { features } = data;
          const placeName = features.find(
            (feature) => feature.place_name !== undefined
          )?.place_name;
          setAddress(placeName);
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
