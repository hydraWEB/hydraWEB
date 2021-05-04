import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import jsonData from '../utils/mmm.json';

import './HydraMap.scss';


export default function HydraMap(props) {

    const mapContainer = useRef();
    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoon] = useState(7)

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        var marker1 = new mapboxgl.Marker()
            .setLngLat([12.554729, 55.70651])
            .addTo(map);

        // Create a default Marker, colored black, rotated 45 degrees.
        var marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
            .setLngLat([12.65147, 55.608166])
            .addTo(map);


        var Draw = new MapboxDraw();

        map.addControl(Draw, 'top-left');

        map.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")

            var res = {
                'type': 'geojson',
                'data': jsonData
            }
            console.log(res)
            map.addSource("data", res)
            map.addLayer({
                'id': 'park-boundary',
                'type': 'fill',
                'source': 'data',
                'paint': {
                    'fill-color': '#888888',
                    'fill-opacity': 0.4
                },
                'filter': ['==', '$type', 'Polygon']
            });

            map.addLayer({
                'id': 'park-volcanoes',
                'type': 'circle',
                'source': 'data',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
        });

        return () => map.remove();
    }, []);


    return (
        <div className="map">
            <div className="map-container" ref={mapContainer} />
        </div>
    )
}