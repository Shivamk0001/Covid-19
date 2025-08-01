import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./Util";
import "./ChangeMapView"
import ChangeMapView from "./ChangeMapView";
function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
        <ChangeMapView center={center} zoom={zoom} animate={true}/>
      </MapContainer>
    </div>
  );
}

export default Map;
