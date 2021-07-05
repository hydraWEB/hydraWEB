import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView, faGlobe, faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons'
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

import gpsdata from '../../utils/gpsdata';
import GNSS from '../../utils/GNSS_WGS84';

import styles from './HydraMap.module.scss';

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
        {name: '彰化', value:'2'},
        {name: '衛星影像', value:'3'}
    ];
    const [radioValue, setRadioValue] = useState('1');
    const [openSheet, setOpenSheet] = useState(false)
    const [openSheet2, setOpenSheet2] = useState(false)
    const [openYL, setOpenYL] = useState(false)
    const [openZH, setOpenZH] = useState(false)
    const [openSatellite, setOpenSatellite] = useState(false)
    //雲林

    const [ylchecked, setylChecked] = useState([
        {
            id:1,
            value: true
        },
        {
            id:2,
            value: true
        },
        {
            id:3,
            value: true
        },
        {
            id:4,
            value: true
        },
        {
            id:5,
            value: true
        },
        {
            id:6,
            value: true
        },
        {
            id:7,
            value: true
        }
    ])
    
    //彰化
    const [zhchecked, setzhChecked] = useState([
        {
            id:1,
            value: true
        },
        {
            id:2,
            value: true
        },
        {
            id:3,
            value: true
        },
        {
            id:4,
            value: true
        },
        {
            id:5,
            value: true
        },
        {
            id:6,
            value: true
        },
        {
            id:7,
            value: true
        }
    ])

    const [satellitechecked, setsatelliteChecked] = useState([
        {
            id:1,
            value: true
        },
        {
            id:2,
            value: true
        },
    ])
    
    const [xCoordinate, setxCoordinate] = useState()
    const [yCoordinate, setyCoordinate] = useState()


    //function for the button for submit xy coordinates
    const onFormSubmit = ((e) =>{
        //map.current.setCenter([xCoordinate,yCoordinate])
        //map.current.setZoom(10)
    })


    const ylhandleToggle1 = ((e)=>{
        if (ylchecked[0]){
            map.current.setLayoutProperty('yldata1','visibility','none')
            let newArr = [...ylchecked]
            newArr[0] = false
            setylChecked(newArr)
            
        }else{
            map.current.setLayoutProperty('yldata1','visibility','visible')
            let newArr = [...ylchecked]
            newArr[0] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle2 = ((e)=>{
        if (ylchecked[1]){
            map.current.setLayoutProperty('yldata2','visibility','none')
            let newArr = [...ylchecked]
            newArr[1] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata2','visibility','visible')
            let newArr = [...ylchecked]
            newArr[1] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle3 = ((e)=>{
        if (ylchecked[2]){
            map.current.setLayoutProperty('yldata3','visibility','none')
            let newArr = [...ylchecked]
            newArr[2] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata3','visibility','visible')
            let newArr = [...ylchecked]
            newArr[2] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle4 = ((e)=>{
        if (ylchecked[3]){
            map.current.setLayoutProperty('yldata4','visibility','none')
            let newArr = [...ylchecked]
            newArr[3] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata4','visibility','visible')
            let newArr = [...ylchecked]
            newArr[3] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle5 = ((e)=>{
        if (ylchecked[4]){
            map.current.setLayoutProperty('yldata5','visibility','none')
            let newArr = [...ylchecked]
            newArr[4] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata5','visibility','visible')
            let newArr = [...ylchecked]
            newArr[4] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle6 = ((e)=>{
        if (ylchecked[5]){
            map.current.setLayoutProperty('yldata6','visibility','none')
            let newArr = [...ylchecked]
            newArr[5] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata6','visibility','visible')
            let newArr = [...ylchecked]
            newArr[6] = true
            setylChecked(newArr)
        }
    })
    const ylhandleToggle7 = ((e)=>{
        if (ylchecked[6]){
            map.current.setLayoutProperty('yldata7','visibility','none')
            let newArr = [...ylchecked]
            newArr[6] = false
            setylChecked(newArr)
        }else{
            map.current.setLayoutProperty('yldata7','visibility','visible')
            let newArr = [...ylchecked]
            newArr[6] = true
            setylChecked(newArr)
        }
    })

    const zhhandleToggle1 = ((e)=>{
        if (zhchecked[0]){
            map.current.setLayoutProperty('zhdata1','visibility','none')
            let newArr = [...zhchecked]
            newArr[0] = false
            setzhChecked(newArr)
            
        }else{
            map.current.setLayoutProperty('zhdata1','visibility','visible')
            let newArr = [...zhchecked]
            newArr[0] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle2 = ((e)=>{
        if (zhchecked[1]){
            map.current.setLayoutProperty('zhdata2','visibility','none')
            let newArr = [...zhchecked]
            newArr[1] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata2','visibility','visible')
            let newArr = [...zhchecked]
            newArr[1] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle3 = ((e)=>{
        if (zhchecked[2]){
            map.current.setLayoutProperty('zhdata3','visibility','none')
            let newArr = [...zhchecked]
            newArr[2] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata3','visibility','visible')
            let newArr = [...zhchecked]
            newArr[2] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle4 = ((e)=>{
        if (zhchecked[3]){
            map.current.setLayoutProperty('zhdata4','visibility','none')
            let newArr = [...zhchecked]
            newArr[3] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata4','visibility','visible')
            let newArr = [...zhchecked]
            newArr[3] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle5 = ((e)=>{
        if (zhchecked[4]){
            map.current.setLayoutProperty('zhdata5','visibility','none')
            let newArr = [...zhchecked]
            newArr[4] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata5','visibility','visible')
            let newArr = [...zhchecked]
            newArr[4] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle6 = ((e)=>{
        if (zhchecked[5]){
            map.current.setLayoutProperty('zhdata6','visibility','none')
            let newArr = [...zhchecked]
            newArr[5] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata6','visibility','visible')
            let newArr = [...zhchecked]
            newArr[6] = true
            setzhChecked(newArr)
        }
    })
    const zhhandleToggle7 = ((e)=>{
        if (zhchecked[6]){
            map.current.setLayoutProperty('zhdata7','visibility','none')
            let newArr = [...zhchecked]
            newArr[6] = false
            setzhChecked(newArr)
        }else{
            map.current.setLayoutProperty('zhdata7','visibility','visible')
            let newArr = [...zhchecked]
            newArr[6] = true
            setzhChecked(newArr)
        }
    })

    const satellitehandleToggle1 = ((e)=>{
        if (satellitechecked[0]){
            map.current.setLayoutProperty('gpsdata','visibility','none')
            let newArr = [...satellitechecked]
            newArr[0] = false
            setsatelliteChecked(newArr)
        }else{
            map.current.setLayoutProperty('gpsdata','visibility','visible')
            let newArr = [...satellitechecked]
            newArr[0] = true
            setsatelliteChecked(newArr)
        }
    })
    const satellitehandleToggle2 = ((e)=>{
        if (satellitechecked[1]){
            map.current.setLayoutProperty('GNSS','visibility','none')
            let newArr = [...satellitechecked]
            newArr[1] = false
            setsatelliteChecked(newArr)
        }else{
            map.current.setLayoutProperty('GNSS','visibility','visible')
            let newArr = [...satellitechecked]
            newArr[1] = true
            setsatelliteChecked(newArr)
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
            
            

        });
        
        return () => map.current.remove();
    },[]);

    useEffect(() => {

        map.current.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")

            var ylres = [
                {
                    'type': 'geojson',
                    'data': yljsonData1
                },
                {
                    'type': 'geojson',
                    'data': yljsonData2
                },
                {
                    'type': 'geojson',
                    'data': yljsonData3
                },
                {
                    'type': 'geojson',
                    'data': yljsonData4
                },
                {
                    'type': 'geojson',
                    'data': yljsonData5
                },
                {
                    'type': 'geojson',
                    'data': yljsonData6
                },
                {
                    'type': 'geojson',
                    'data': yljsonData7
                }
            ]
            var zhres = [
                {
                    'type': 'geojson',
                    'data': zhjsonData1
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData2
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData3
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData4
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData5
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData6
                },
                {
                    'type': 'geojson',
                    'data': zhjsonData7
                }
            ]
            var satellite = [
                {
                    'type': 'geojson',
                    'data': gpsdata
                },
                {
                    'type': 'geojson',
                    'data': GNSS
                }
            ]

            map.current.addSource("yldata1", ylres[0])
            map.current.addSource("yldata2", ylres[1])
            map.current.addSource("yldata3", ylres[2])
            map.current.addSource("yldata4", ylres[3])
            map.current.addSource("yldata5", ylres[4])
            map.current.addSource("yldata6", ylres[5])
            map.current.addSource("yldata7", ylres[6])

            map.current.addSource("zhdata1", zhres[0])
            map.current.addSource("zhdata2", zhres[1])
            map.current.addSource("zhdata3", zhres[2])
            map.current.addSource("zhdata4", zhres[3])
            map.current.addSource("zhdata5", zhres[4])
            map.current.addSource("zhdata6", zhres[5])
            map.current.addSource("zhdata7", zhres[6])

            map.current.addSource("gpsdata", satellite[0])
            map.current.addSource("GNSS", satellite[1])

            map.current.addLayer({
                'id': 'gpsdata',
                'type': 'circle',
                'source': 'gpsdata',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f77777'
                },
                'filter': ['==', '$type', 'Point']
            });

            map.current.addLayer({
                'id': 'GNSS',
                'type': 'circle',
                'source': 'GNSS',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f77777'
                },
                'filter': ['==', '$type', 'Point']
            });
            
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
                'id': 'zhdata1',
                'type': 'circle',
                'source': 'zhdata1',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#888888'
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
            map.current.on('click','zhdata1', function (e){
                var coordinates = e.features[0].geometry.coordinates.slice();
                var coordinateName = e.features[0].properties.點名;
                const front = "<h6 style='color:red'>"
                const back = "</h6>"
                var otherCoordinates2 = front + "點名:" +coordinateName + back
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(otherCoordinates2)
                    .addTo(map.current);
            })
            map.current.on('click','GNSS', function (e){
                var coordinates = e.features[0].geometry.coordinates.slice();
                var coordinateName = e.features[0].properties.測站名;
                const front = "<h6 style='color:red'>"
                const back = "</h6>"
                var otherCoordinates2 = front + "測站名:" + coordinateName + back
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(otherCoordinates2)
                    .addTo(map.current);
            })
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.current.on('mouseenter', 'zhdata1', function () {
                map.current.getCanvas().style.cursor = 'pointer';
            });
                 
            // Change it back to a pointer when it leaves.
            map.current.on('mouseleave', 'data', function () {
                map.current.getCanvas().style.cursor = '';
            });
        });
        
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
            setOpenYL(true)
            setOpenZH(false)
            setOpenSatellite(false)
        } else if(radioValue == '2'){
            setOpenYL(false)
            setOpenZH(true)
            setOpenSatellite(false)
        }
        else{
            setOpenYL(false)
            setOpenZH(false)
            setOpenSatellite(true)
        }
    })

    const showMiniMenu = ((e) =>{
        setOpenSheet2(true)
    })

    

    return (
        <>
            <div className={styles.top_level_nav}>
                <nav className={styles.top_level_nav_wrapper}>
                    <ul>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        搜尋
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={searchSheetToggle} icon={faSearch} size="lg" color="white" id='app-icon' />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        圖層套疊
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={layerToggle} icon={faClone} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        3D轉換
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={threeDToggle} icon={faExchangeAlt} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        環域分析
                                            </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={areaToggle} icon={faStreetView} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        列印
                        </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={printToggle} icon={faPrint} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        定位
                        </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={positioningToggle} icon={faMapMarker} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                    </ul>
                </nav>
            </div>
            { openSheet ?
                <div className={styles.menu_desk_outer_layer} >
                    {
                        currentFunction == 0 && <div>
                            <h4 className={styles.func_title}>搜尋</h4>
                            <Dropdown classname = {styles.droplist}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Dropdown Button
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    }
                    {
                        currentFunction == 1 && <div>
                            <h4 className={styles.func_title}>圖層套疊</h4>
                            <br></br>       
                            <ButtonGroup toggle vertical>
                                {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    type="radio"
                                    variant="secondary"
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={changeRegion}
                                    onClick={showMiniMenu}
                                >
                                    {radio.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup>
                            {openSheet2 ?
                            <div className={styles.menu_desk_third_layer}>
                                { openYL ?
                                <div className= {styles.ylcheckbox}>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[0].value} 
                                            onClick={ylhandleToggle1}
                                        />108雲林地區地層下陷加密水準檢測成果表
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[1].value} 
                                            onClick={ylhandleToggle2}
                                        />108雲林地區地層下陷水準檢測成果表
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[2].value} 
                                            onClick={ylhandleToggle3}
                                        />GPS站_雲林縣
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[3].value} 
                                            onClick={ylhandleToggle4}
                                        />台灣自來水公司第五區_雲林抽水井位置圖
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[4].value} 
                                            onClick={ylhandleToggle5}
                                        />地陷監測井_雲林縣
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[5].value} 
                                            onClick={ylhandleToggle6}
                                        />水準樁_雲林縣
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={ylchecked[6].value} 
                                            onClick={ylhandleToggle7}
                                        />雲林水利會抽水井位置圖
                                    </label>
                                </div>
                                :
                                <div></div>
                                }
                                {openZH ?
                                    <div className= {styles.zhcheckbox}>
                                        <div className= {styles.zhcheckbox}>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[0].value} 
                                                    onClick={zhhandleToggle1}
                                                />108彰化地區地層下陷加密水準檢測成果表
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[1].value} 
                                                    onClick={zhhandleToggle2}
                                                />108彰化地區地層下陷水準檢測成果表
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[2].value} 
                                                    onClick={zhhandleToggle3}
                                                />GPS站_彰化縣
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[3].value} 
                                                    onClick={zhhandleToggle4}
                                                />台灣自來水公司第十一區_彰化抽水井位置圖
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[4].value} 
                                                    onClick={zhhandleToggle5}
                                                />地陷監測井_彰化縣
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[5].value} 
                                                    onClick={zhhandleToggle6}
                                                />彰化水利會抽水井位置圖
                                            </label>
                                            <br></br>
                                            <label>
                                                <input 
                                                    type="checkbox"
                                                    checked={zhchecked[6].value} 
                                                    onClick={zhhandleToggle7}
                                                />水準樁_彰化縣
                                            </label>
                                        </div>
                                    </div>
                                    :
                                    <div></div>
                                }
                                {openSatellite ?
                                    <div className={styles.satellitecheckbox}>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={satellitechecked[0].value} 
                                            onClick={satellitehandleToggle1}
                                        />GPSData
                                    </label>
                                    <br></br>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            checked={satellitechecked[1].value} 
                                            onClick={satellitehandleToggle2}
                                        />GNSS_WGS84
                                    </label>
                                </div>
                                    :
                                    <div></div>
                                }
                            </div>:
                            <div></div>
                            }
                            
                            
                        </div>
                    }
                    {
                        currentFunction == 2 && <div>
                            <h4 className={styles.func_title}>3D轉換</h4>
                        </div>
                    }
                    {
                        currentFunction == 3 && <div>
                            <h4 className={styles.func_title}>環域分析</h4>

                        </div>
                    }
                    {
                        currentFunction == 4 && <div>
                            <h4 className={styles.func_title}>列印</h4>

                        </div>
                    }
                    {
                        currentFunction == 5 && <div>
                            <h4 className={styles.func_title}>定位</h4>
                            <label></label>
                        </div>
                    }
                </div> :
                <div></div>
            }
            
            <div className={styles.fragment}>
                <div className={styles.map} id = "map">
                    <div className={styles.map_container} ref={mapContainer} />
                </div>
            </div>
        </>
    )
}