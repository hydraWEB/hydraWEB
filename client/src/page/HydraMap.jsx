import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import jsonData from '../utils/108台北地區水準測量檢測成果表.json';
import jsonData2 from '../utils/108彰化地區地層下陷加密水準檢測成果表.json';

import './HydraMap.scss';

mapboxgl.accessToken = 
    'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';

export default function HydraMap(props) {

    const mapContainer = useRef();
    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoon] = useState(7)
    const [currentFunction, setCurrentFunction] = useState(0)
    const [openSheet, setOpenSheet] = useState(false)
    const [showLayer,setShowLayer] = useState(false)
    const showLayerToggle = ((e) =>{
        setShowLayer(true)
        alert(showLayer)
    })

    const hideLayerToggle = ((e)=>{
        setShowLayer(false)
        alert(showLayer)
        
    })

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        
        var Draw = new MapboxDraw();

        
        map.addControl(Draw, 'top-left');

        map.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")

            var res = {
                'type': 'geojson',
                'data': jsonData
            }
            var res2 = {
                'type': 'geojson',
                'data': jsonData2
            }

            console.log(res)
            map.addSource("data", res)
            map.addSource("data2", res2)
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
                'id': 'data',
                'type': 'circle',
                'source': 'data',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            
            map.addLayer({
                'id': 'data2',
                'type': 'circle',
                'source': 'data2',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            
            map.on('click','data', function (e){
                var coordinates = e.features[0].geometry.coordinates.slice();
                var otherCoordinates = e.features[0].properties.TWD97_Y;
                const front = "<h1 style='color:red'>"
                const back = "</h1>"
                var otherCoordinates2 = front + otherCoordinates + back
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(otherCoordinates2)
                    .addTo(map);
            })
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'data', function () {
                map.getCanvas().style.cursor = 'pointer';
            });
                 
            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'data', function () {
                map.getCanvas().style.cursor = '';
            });

            if(showLayer){
                map.setLayoutProperty('data','visibility','none')
            }
            
        });

        
        
        return () => map.remove();
    },showLayer);


    

    const searchSheetToggle = ((e) => {
        if (openSheet && currentFunction == 0) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(0)
    })

    const layerToggle = ((e) => {
        if (openSheet && currentFunction == 1) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(1)
    })

    const threeDToggle = ((e) => {
        if (openSheet && currentFunction == 2) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(2)
    })

    const areaToggle = ((e) => {
        if (openSheet && currentFunction == 3) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(3)
    })

    const printToggle = ((e) => {
        if (openSheet && currentFunction == 4) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(4)
    })

    const positioningToggle = ((e) => {
        if (openSheet && currentFunction == 5) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(5)
    })

    

    return (
        <>
            <div className="top-level-nav">
                <nav className='top-level-nav-wrapper'>
                    <ul>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        搜尋
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={searchSheetToggle} icon={faSearch} size="lg" color="white" id='app-icon' />
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        圖層套疊
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={layerToggle} icon={faClone} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        3D轉換
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={threeDToggle} icon={faExchangeAlt} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        環域分析
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={areaToggle} icon={faStreetView} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        列印
                        </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={printToggle} icon={faPrint} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className='tooltip'>
                                        定位
                        </Tooltip>
                                }>
                                <FontAwesomeIcon className="menu-btn" onClick={positioningToggle} icon={faMapMarker} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                    </ul>
                </nav>
            </div>
            { openSheet ?
                <div className="menu-desk" >
                    {
                        currentFunction == 0 && <div>
                            <h4 className="func-title">搜尋</h4>

                        </div>
                    }
                    {
                        currentFunction == 1 && <div id='menu'>
                            <h4 className="func-title">圖層套疊</h4>
                            <br></br>
                            <div id = "toggle">
                                <Button onClick={showLayerToggle}>Show</Button>
                                <Button onClick={hideLayerToggle}>Hide</Button>
                            </div>
                        </div>
                    }
                    {
                        currentFunction == 2 && <div>
                            <h4 className="func-title">3D轉換</h4>
                        </div>
                    }
                    {
                        currentFunction == 3 && <div>
                            <h4 className="func-title">環域分析</h4>

                        </div>
                    }
                    {
                        currentFunction == 4 && <div>
                            <h4 className="func-title">列印</h4>

                        </div>
                    }
                    {
                        currentFunction == 5 && <div>
                            <h4 className="func-title">定位</h4>
                            
                        </div>
                    }
                </div> :
                <div></div>
            }

            <div className="fragment">
                <div className="map" id = "map">
                    <div className="map-container" ref={mapContainer} />
                </div>
            </div>
        </>
    )
}