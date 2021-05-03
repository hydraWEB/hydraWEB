import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState,useRef } from 'react';

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
        return () => map.remove();
    }, []);


    return (
        <div className="map">
            <div className="map-container" ref={mapContainer} />
        </div>
    )
}