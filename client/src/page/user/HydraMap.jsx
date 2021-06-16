import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, Dropdown , FormControl , 
    NavDropdown, ToggleButton, ToggleButtonGroup, InputGroup, Form, ButtonGroup } from 'react-bootstrap';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import zhjsonData1 from '../../utils/108彰化地區地層下陷加密水準檢測成果表.json';
import zhjsonData2 from '../../utils/108彰化地區地層下陷水準檢測成果表';
import zhjsonData3 from '../../utils/GPS站_彰化縣';
import zhjsonData4 from '../../utils/台灣自來水公司第十一區_彰化抽水井位置圖';
import zhjsonData5 from '../../utils/地層下陷監測點_彰化縣';
import zhjsonData6 from '../../utils/彰化水利會抽水井位置圖';
import zhjsonData7 from '../../utils/水準樁_彰化縣';

import yljsonData1 from '../../utils/108雲林地區地層下陷加密水準檢測成果表';
import yljsonData2 from '../../utils/108雲林地區地層下陷水準檢測成果表';
import yljsonData3 from '../../utils/GPS站_雲林縣';
import yljsonData4 from '../../utils/台灣自來水公司第五區_雲林抽水井位置圖';
import yljsonData5 from '../../utils/地層下陷監測點_雲林縣';
import yljsonData6 from '../../utils/水準樁_雲林縣';
import yljsonData7 from '../../utils/雲林水利會抽水井位置圖';



import './HydraMap.module.scss';

mapboxgl.accessToken = 
    'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';

export default function HydraMap(props) {

    const mapContainer = useRef();
    const map = useRef(null);
    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoon] = useState(7)
    const [currentFunction, setCurrentFunction] = useState(0)
    const radios = [
        {name: '雲林',value:'1'},
        {name: '彰化', value:'2'}
    ];
    const [radioValue, setRadioValue] = useState('1');
    const [openSheet, setOpenSheet] = useState(false)
    const [openYL, setOpenYL] = useState(true)
    //雲林
    const [ylchecked1, ylsetChecked1] = useState(true);
    const [ylchecked2, ylsetChecked2] = useState(true);
    const [ylchecked3, ylsetChecked3] = useState(true);
    const [ylchecked4, ylsetChecked4] = useState(true);
    const [ylchecked5, ylsetChecked5] = useState(true);
    const [ylchecked6, ylsetChecked6] = useState(true);
    const [ylchecked7, ylsetChecked7] = useState(true);
    //彰化
    const [zhchecked1, zhsetChecked1] = useState(true);
    const [zhchecked2, zhsetChecked2] = useState(true);
    const [zhchecked3, zhsetChecked3] = useState(true);
    const [zhchecked4, zhsetChecked4] = useState(true);
    const [zhchecked5, zhsetChecked5] = useState(true);
    const [zhchecked6, zhsetChecked6] = useState(true);
    const [zhchecked7, zhsetChecked7] = useState(true);

    const [xCoordinate, setxCoordinate] = useState()
    const [yCoordinate, setyCoordinate] = useState()

    var tempMarker = useState()

    //function for the button for submit xy coordinates
    const onFormSubmit = ((e) =>{
        //map.current.setCenter([xCoordinate,yCoordinate])
        //map.current.setZoom(10)
        tempMarker = new mapboxgl.Marker()
        .setLngLat([xCoordinate, yCoordinate])
        .addTo(map.current);
    })

    const onFormDelete = ((e =>{
        tempMarker.remove()
    }))

    const ylhandleToggle1 = ((e)=>{
        if (ylchecked1){
            map.current.setLayoutProperty('yldata1','visibility','none')
            ylsetChecked1(false)
        }else{
            map.current.setLayoutProperty('yldata1','visibility','visible')
            ylsetChecked1(true)
        }
    })
    const ylhandleToggle2 = ((e)=>{
        if (ylchecked2){
            map.current.setLayoutProperty('yldata2','visibility','none')
            ylsetChecked2(false)
        }else{
            map.current.setLayoutProperty('yldata2','visibility','visible')
            ylsetChecked2(true)
        }
    })
    const ylhandleToggle3 = ((e)=>{
        if (ylchecked3){
            map.current.setLayoutProperty('yldata3','visibility','none')
            ylsetChecked3(false)
        }else{
            map.current.setLayoutProperty('yldata3','visibility','visible')
            ylsetChecked3(true)
        }
    })
    const ylhandleToggle4 = ((e)=>{
        if (ylchecked4){
            map.current.setLayoutProperty('yldata4','visibility','none')
            ylsetChecked4(false)
        }else{
            map.current.setLayoutProperty('yldata4','visibility','visible')
            ylsetChecked4(true)
        }
    })
    const ylhandleToggle5 = ((e)=>{
        if (ylchecked5){
            map.current.setLayoutProperty('yldata5','visibility','none')
            ylsetChecked5(false)
        }else{
            map.current.setLayoutProperty('yldata5','visibility','visible')
            ylsetChecked5(true)
        }
    })
    const ylhandleToggle6 = ((e)=>{
        if (ylchecked6){
            map.current.setLayoutProperty('yldata6','visibility','none')
            ylsetChecked6(false)
        }else{
            map.current.setLayoutProperty('yldata6','visibility','visible')
            ylsetChecked6(true)
        }
    })
    const ylhandleToggle7 = ((e)=>{
        if (ylchecked7){
            map.current.setLayoutProperty('yldata7','visibility','none')
            ylsetChecked7(false)
        }else{
            map.current.setLayoutProperty('yldata7','visibility','visible')
            ylsetChecked7(true)
        }
    })

    const zhhandleToggle1 = ((e)=>{
        if (zhchecked1){
            map.current.setLayoutProperty('zhdata1','visibility','none')
            zhsetChecked1(false)
        }else{
            map.current.setLayoutProperty('zhdata1','visibility','visible')
            zhsetChecked1(true)
        }
    })
    const zhhandleToggle2 = ((e)=>{
        if (zhchecked2){
            map.current.setLayoutProperty('zhdata2','visibility','none')
            zhsetChecked2(false)
        }else{
            map.current.setLayoutProperty('zhdata2','visibility','visible')
            zhsetChecked2(true)
        }
    })
    const zhhandleToggle3 = ((e)=>{
        if (zhchecked3){
            map.current.setLayoutProperty('zhdata3','visibility','none')
            zhsetChecked3(false)
        }else{
            map.current.setLayoutProperty('zhdata3','visibility','visible')
            zhsetChecked3(true)
        }
    })
    const zhhandleToggle4 = ((e)=>{
        if (zhchecked4){
            map.current.setLayoutProperty('zhdata4','visibility','none')
            zhsetChecked4(false)
        }else{
            map.current.setLayoutProperty('zhdata4','visibility','visible')
            zhsetChecked4(true)
        }
    })
    const zhhandleToggle5 = ((e)=>{
        if (zhchecked5){
            map.current.setLayoutProperty('zhdata5','visibility','none')
            zhsetChecked5(false)
        }else{
            map.current.setLayoutProperty('zhdata5','visibility','visible')
            zhsetChecked5(true)
        }
    })
    const zhhandleToggle6 = ((e)=>{
        if (zhchecked6){
            map.current.setLayoutProperty('zhdata6','visibility','none')
            zhsetChecked6(false)
        }else{
            map.current.setLayoutProperty('zhdata6','visibility','visible')
            zhsetChecked6(true)
        }
    })
    const zhhandleToggle7 = ((e)=>{
        if (zhchecked7){
            map.current.setLayoutProperty('zhdata7','visibility','none')
            zhsetChecked7(false)
        }else{
            map.current.setLayoutProperty('zhdata7','visibility','visible')
            zhsetChecked7(true)
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
        
        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }), 'bottom-right'
        );

        map.current.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")

            var zhres1 = {
                'type': 'geojson',
                'data': zhjsonData1
            }

            console.log(zhres1)
            map.current.addSource("zhdata1", zhres1)
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
                'id': 'zhdata1',
                'type': 'circle',
                'source': 'zhdata1',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.setLayoutProperty('zhdata1','visibility','none')
            
            map.current.on('click','zhdata1', function (e){
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

    useEffect(() => {

        map.current.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")

            var ylres1 = {
                'type': 'geojson',
                'data': yljsonData1
            }
            var ylres2 = {
                'type': 'geojson',
                'data': yljsonData2
            }
            var ylres3 = {
                'type': 'geojson',
                'data': yljsonData3
            }
            var ylres4 = {
                'type': 'geojson',
                'data': yljsonData4
            }
            var ylres5 = {
                'type': 'geojson',
                'data': yljsonData5
            }
            var ylres6 = {
                'type': 'geojson',
                'data': yljsonData6
            }
            var ylres7 = {
                'type': 'geojson',
                'data': yljsonData7
            }

            var zhres1 = {
                'type': 'geojson',
                'data': zhjsonData1
            }
            var zhres2 = {
                'type': 'geojson',
                'data': zhjsonData2
            }
            var zhres3 = {
                'type': 'geojson',
                'data': zhjsonData3
            }
            var zhres4 = {
                'type': 'geojson',
                'data': zhjsonData4
            }
            var zhres5 = {
                'type': 'geojson',
                'data': zhjsonData5
            }
            var zhres6 = {
                'type': 'geojson',
                'data': zhjsonData6
            }
            var zhres7 = {
                'type': 'geojson',
                'data': zhjsonData7
            }

            map.current.addSource("yldata1", ylres1)
            map.current.addSource("yldata2", ylres2)
            map.current.addSource("yldata3", ylres3)
            map.current.addSource("yldata4", ylres4)
            map.current.addSource("yldata5", ylres5)
            map.current.addSource("yldata6", ylres6)
            map.current.addSource("yldata7", ylres7)

            map.current.addSource("zhdata2", zhres2)
            map.current.addSource("zhdata3", zhres3)
            map.current.addSource("zhdata4", zhres4)
            map.current.addSource("zhdata5", zhres5)
            map.current.addSource("zhdata6", zhres6)
            map.current.addSource("zhdata7", zhres7)

            
            
            map.current.addLayer({
                'id': 'yldata1',
                'type': 'circle',
                'source': 'yldata1',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata2',
                'type': 'circle',
                'source': 'yldata2',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata3',
                'type': 'circle',
                'source': 'yldata3',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata4',
                'type': 'circle',
                'source': 'yldata4',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata5',
                'type': 'circle',
                'source': 'yldata5',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata6',
                'type': 'circle',
                'source': 'yldata6',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'yldata7',
                'type': 'circle',
                'source': 'yldata7',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f72585'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata2',
                'type': 'circle',
                'source': 'zhdata2',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata3',
                'type': 'circle',
                'source': 'zhdata3',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata4',
                'type': 'circle',
                'source': 'zhdata4',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata5',
                'type': 'circle',
                'source': 'zhdata5',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata6',
                'type': 'circle',
                'source': 'zhdata6',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
            map.current.addLayer({
                'id': 'zhdata7',
                'type': 'circle',
                'source': 'zhdata7',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
                },
                'filter': ['==', '$type', 'Point']
            });
        });
        return () => map.current.remove();
    },[]);
    

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
    
    const changeRegion = ((e) =>{
        setRadioValue(e.currentTarget.value)
        if (radioValue == "1") {
            setOpenYL(false)
        } else{
            setOpenYL(true)
        }
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
                            <Dropdown classname = "droplist">
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Dropdown Button
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <br></br>
                            <Form.Group className="getXYCoordinate">
                                <Form.Control
                                    placeholder="X-Coordinates"
                                    value = {xCoordinate}
                                    onChange={event => setxCoordinate(event.target.value)}
                                    type="text"
                                />
                                <Form.Control
                                    placeholder="Y-Coordinates"
                                    value = {yCoordinate}
                                    onChange={event => setyCoordinate(event.target.value)}
                                    type="text"
                                />
                                <Button className="btnFormSend" variant="outline-success" onClick={onFormSubmit}>
                                Find Location
                                </Button>
                                <Button className="btnFormDelete" variant="outline-success" onClick={onFormDelete}>
                                Delete Location
                                </Button>
                            </Form.Group>
                        </div>
                    }
                    {
                        currentFunction == 1 && <div>
                            <h4 className="func-title">圖層套疊</h4>
                            <br></br>       
                            <ButtonGroup toggle>
                                {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    type="radio"
                                    variant="secondary"
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={changeRegion}
                                >
                                    {radio.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup>
                            { openYL ?
                                <div className= "ylcheckbox">
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked1} 
                                            onClick={ylhandleToggle1}
                                        />108雲林地區地層下陷加密水準檢測成果表
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked2} 
                                            onClick={ylhandleToggle2}
                                        />108雲林地區地層下陷水準檢測成果表
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked3} 
                                            onClick={ylhandleToggle3}
                                        />GPS站_雲林縣
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked4} 
                                            onClick={ylhandleToggle4}
                                        />台灣自來水公司第五區_雲林抽水井位置圖
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked5} 
                                            onClick={ylhandleToggle5}
                                        />地層下陷監測點_雲林縣
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked6} 
                                            onClick={ylhandleToggle6}
                                        />水準樁_雲林縣
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked7} 
                                            onClick={ylhandleToggle7}
                                        />雲林水利會抽水井位置圖
                                    </label>
                                </div>
                                :
                                <div className= "zhcheckbox">
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked1} 
                                            onClick={zhhandleToggle1}
                                        />108彰化地區地層下陷加密水準檢測成果表
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked2} 
                                            onClick={zhhandleToggle2}
                                        />108彰化地區地層下陷水準檢測成果表
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked3} 
                                            onClick={zhhandleToggle3}
                                        />GPS站_彰化縣
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked4} 
                                            onClick={zhhandleToggle4}
                                        />台灣自來水公司第十一區_彰化抽水井位置圖
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked5} 
                                            onClick={zhhandleToggle5}
                                        />地層下陷監測點_彰化縣
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked6} 
                                            onClick={zhhandleToggle6}
                                        />彰化水利會抽水井位置圖
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={zhchecked7} 
                                            onClick={zhhandleToggle7}
                                        />水準樁_彰化縣
                                    </label>
                                </div>
                            }
                            
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
                            <label></label>
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