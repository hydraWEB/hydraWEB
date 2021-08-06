import React from "react";
import ReactDOM from "react-dom";
import DeckGL from "deck.gl";
import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode
} from "nebula.gl";
import { StaticMap } from "react-map-gl";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA";

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12
};

export default function GeometryEditor() {
 
  return (
    <>
      <div>
        
      </div>
    </>
  );
}
