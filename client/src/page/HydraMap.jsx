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

        var marker = new mapboxgl.Marker()
            .setLngLat([12.554729, 55.70651])
            .setPopup(new mapboxgl.Popup().setHTML("<h1 style='color:red'>Hello World!</h1>"))
            .addTo(map);
            console.log(marker.getPopup()); // return the popup instance

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
            /*
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
            */

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
            /*
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
            */
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

        });
        /*
        map.on('idle', function () {
            // If these two layers have been added to the style,
            // add the toggle buttons.
            if (map.getLayer('data') && map.getLayer('data2')) {
                // Enumerate ids of the layers.
                var toggleableLayerIds = ['contours', 'museums'];
                // Set up the corresponding toggle button for each layer.
                for (var i = 0; i < toggleableLayerIds.length; i++) {
                    var id = toggleableLayerIds[i];
                    if (!document.getElementById(id)) {
                        // Create a link.
                        var link = document.createElement('a');
                        link.id = id;
                        link.href = '#';
                        link.textContent = id;
                        link.className = 'active';
                        // Show or hide layer when the toggle is clicked.
                        link.onclick = function (e) {
                            var clickedLayer = this.textContent;
                            e.preventDefault();
                            e.stopPropagation();
    
                            var visibility = map.getLayoutProperty(
                                clickedLayer,
                                'visibility'
                            );
    
                            // Toggle layer visibility by changing the layout object's visibility property.
                            if (visibility === 'visible') {
                                map.setLayoutProperty(
                                    clickedLayer,
                                    'visibility',
                                    'none'
                                );
                                this.className = '';
                            } else {
                                this.className = 'active';
                                map.setLayoutProperty(
                                    clickedLayer,
                                    'visibility',
                                    'visible'
                                );
                            }
                        };
    
                        //var layers = document.getElementById('menu');
                        //layers.appendChild(link);
                    }
                }
            }
        });
        */
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
                        currentFunction == 1 && <div id='menu'>
                            <h4 className="func-title">圖層套疊</h4>
                            <input id='Test_A' type='radio' name='rtoggle' value='Test_A' checked='checked'></input>
                            <label for='Test_A'>108</label>
                            <input id='Test_B' type='radio' name='rtoggle' value='Test_B'></input>
                            <label for='Test_B'>NKN</label>
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