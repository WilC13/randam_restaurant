// "use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { KEY } from "../global/config";

const mapId = "b01e012254f22641";

function MyMap({ lat, lng, zoom }) {
  const position = { lat: lat, lng: lng };
  const [open, setOpen] = useState(false);
  return (
    <APIProvider apiKey={KEY}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map defaultZoom={zoom} defaultCenter={position} mapId={mapId}>
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin
              background={"orange"}
              borderColor={"red"}
              glyphColor={"gold"}
            />
            <InfoWindow></InfoWindow>
          </AdvancedMarker>
          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <div>
                <h1>InfoWindow</h1>
                <p>Latitude: {lat}</p>
                <p>Longitude: {lng}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

MyMap.defaultProps = {
  lat: 22.302711,
  lng: 114.177216,
  zoom: 12,
};

export default MyMap;
