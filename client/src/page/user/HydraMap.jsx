import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown, ToggleButton, ToggleButtonGroup, InputGroup, Form } from 'react-bootstrap';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import jsonData from '../../utils/108台北地區水準測量檢測成果表.json';
import jsonData2 from '../../utils/108彰化地區地層下陷加密水準檢測成果表.json';
import jsonData3 from '../../utils/108屏東地區水準測量檢測成果表.json';
import jsonData4 from '../../utils/108彰化地區地層下陷水準檢測成果表.json';
import jsonData5 from '../../utils/108嘉義地區水準測量檢測成果表.json';
import jsonData6 from '../../utils/108臺南地區水準測量檢測成果表.json';
import jsonData7 from '../../utils/108雲林地區地層下陷加密水準檢測成果表.json';
import jsonData8 from '../../utils/108雲林地區地層下陷水準檢測成果表.json';

import './HydraMap.scss';

mapboxgl.accessToken = 
    'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';

export default function HydraMap(props) {

    const mapContainer = useRef();
    const map = useRef(null);
    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoon] = useState(7)
    const [currentFunction, setCurrentFunction] = useState(0)
    const [openSheet, setOpenSheet] = useState(false)
    const [checked1, setChecked1] = useState(true);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(true);
    const [checked4, setChecked4] = useState(true);
    const [checked5, setChecked5] = useState(true);
    const [checked6, setChecked6] = useState(true);
    const [checked7, setChecked7] = useState(true);
    const [checked8, setChecked8] = useState(true);
    const showLayerToggle = ((e) =>{
        map.current.setLayoutProperty('data','visibility','visible')
    })

    const hideLayerToggle = ((e)=>{
        map.current.setLayoutProperty('data','visibility','none')
    })

    const handleToggle1 = ((e)=>{
        if (checked1){
            map.current.setLayoutProperty('data','visibility','none')
            setChecked1(false)
        }else{
            map.current.setLayoutProperty('data','visibility','visible')
            setChecked1(true)
        }
    })
    const handleToggle2 = ((e)=>{
        if (checked2){
            map.current.setLayoutProperty('data2','visibility','none')
            setChecked2(false)
        }else{
            map.current.setLayoutProperty('data2','visibility','visible')
            setChecked2(true)
        }
    })
    const handleToggle3 = ((e)=>{
        if (checked3){
            map.current.setLayoutProperty('data3','visibility','none')
            setChecked3(false)
        }else{
            map.current.setLayoutProperty('data3','visibility','visible')
            setChecked3(true)
        }
    })
    const handleToggle4 = ((e)=>{
        if (checked4){
            map.current.setLayoutProperty('data4','visibility','none')
            setChecked4(false)
        }else{
            map.current.setLayoutProperty('data4','visibility','visible')
            setChecked4(true)
        }
    })
    const handleToggle5 = ((e)=>{
        if (checked5){
            map.current.setLayoutProperty('data5','visibility','none')
            setChecked5(false)
        }else{
            map.current.setLayoutProperty('data5','visibility','visible')
            setChecked5(true)
        }
    })
    const handleToggle6 = ((e)=>{
        if (checked6){
            map.current.setLayoutProperty('data6','visibility','none')
            setChecked6(false)
        }else{
            map.current.setLayoutProperty('data6','visibility','visible')
            setChecked6(true)
        }
    })
    const handleToggle7 = ((e)=>{
        if (checked7){
            map.current.setLayoutProperty('data7','visibility','none')
            setChecked7(false)
        }else{
            map.current.setLayoutProperty('data7','visibility','visible')
            setChecked7(true)
        }
    })
    const handleToggle8 = ((e)=>{
        if (checked8){
            map.current.setLayoutProperty('data8','visibility','none')
            setChecked8(false)
        }else{
            map.current.setLayoutProperty('data8','visibility','visible')
            setChecked8(true)
        }
    })
    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        
        var Draw = new MapboxDraw();

        
        map.current.addControl(Draw, 'top-left');

        map.current.on('load', function () {
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
            var res3 = {
                'type': 'geojson',
                'data': jsonData3
            }
            var res4 = {
                'type': 'geojson',
                'data': jsonData4
            }
            var res5 = {
                'type': 'geojson',
                'data': jsonData5
            }
            var res6 = {
                'type': 'geojson',
                'data': jsonData6
            }
            var res7 = {
                'type': 'geojson',
                'data': jsonData7
            }
            var res8 = {
                'type': 'geojson',
                'data': jsonData8
            }

            console.log(res)
            map.current.addSource("data", res)
            map.current.addSource("data2", res2)
            map.current.addSource("data3", res3)
            map.current.addSource("data4", res4)
            map.current.addSource("data5", res5)
            map.current.addSource("data6", res6)
            map.current.addSource("data7", res7)
            map.current.addSource("data8", res8)
            map.current.addLayer({
                'id': 'park-boundary',
                'type': 'fill',
                'source': 'data',
                'paint': {
                    'fill-color': '#888888',
                    'fill-opacity': 0.4
                },
                'filter': ['==', '$type', 'Polygon']
            });
            
            map.current.addLayer({
                'id': 'data',
                'type': 'circle',
                'source': 'data',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data2',
                'type': 'circle',
                'source': 'data2',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data3',
                'type': 'circle',
                'source': 'data3',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data4',
                'type': 'circle',
                'source': 'data4',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data5',
                'type': 'circle',
                'source': 'data5',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data6',
                'type': 'circle',
                'source': 'data6',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data7',
                'type': 'circle',
                'source': 'data7',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'data8',
                'type': 'circle',
                'source': 'data8',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            
            map.current.on('click','data', function (e){
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
                    .addTo(map.current);
            })
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.current.on('mouseenter', 'data', function () {
                map.current.getCanvas().style.cursor = 'pointer';
            });
                 
            // Change it back to a pointer when it leaves.
            map.current.on('mouseleave', 'data', function () {
                map.current.getCanvas().style.cursor = '';
            });
        });
        
        return () => map.current.remove();
    },[]);

    useEffect(() =>{

    })
    

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
                        currentFunction == 1 && <div>
                            <h4 className="func-title">圖層套疊</h4>
                            <br></br>
                            <div className= "checkbox">
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked1} 
                                        onClick={handleToggle1}
                                    />108台北地區水準測量檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked2} 
                                        onClick={handleToggle2}
                                    />108彰化地區地層下陷加密水準檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked3} 
                                        onClick={handleToggle3}
                                    />108屏東地區水準測量檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked4} 
                                        onClick={handleToggle4}
                                    />108彰化地區地層下陷水準檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked5} 
                                        onClick={handleToggle5}
                                    />108嘉義地區水準測量檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked6} 
                                        onClick={handleToggle6}
                                    />108臺南地區水準測量檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked7} 
                                        onClick={handleToggle7}
                                    />108雲林地區地層下陷加密水準檢測成果表
                                </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checked8} 
                                        onClick={handleToggle8}
                                    />108雲林地區地層下陷水準檢測成果表
                                </label>
                                <br></br>
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