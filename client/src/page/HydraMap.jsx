import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';


import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import jsonData from '../utils/GeoObs1000.json';

import './HydraMap.scss';


export default function HydraMap(props) {

    const mapContainer = useRef();
    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoon] = useState(7)
    const [currentFunction, setCurrentFunction] = useState(0)
    const [openSheet, setOpenSheet] = useState(false)

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
        <div className="App">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" classname="navbar">
                <Navbar.Brand href="home">水文與下陷監測巨量資料運算平台</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="notification">公告</Nav.Link>
                        <Nav.Link href="profile">個人帳號</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
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
                        currentFunction == 1 && <div>
                            <h4 className="func-title">圖層套疊</h4>

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
                <div className="map">
                    <div className="map-container" ref={mapContainer} />
                </div>
            </div>
        </div>
    )
}