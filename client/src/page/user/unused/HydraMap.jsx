import React, { useEffect, useState, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPrint,
    faMapMarker,
    faSearch,
    faCircle,
    faPlusCircle,
    faCircleNotch,
    faArrowCircleDown,
    faICursor,
    faDotCircle,
    faExchangeAlt,
    faColumns,
    faClone,
    faStreetView,
    faGlobe,
    faBatteryThreeQuarters
} from '@fortawesome/free-solid-svg-icons'
import {
    OverlayTrigger, Tooltip, Button, Navbar, Nav, Dropdown, FormControl,
    NavDropdown, ToggleButton, ToggleButtonGroup, InputGroup, Form, ButtonGroup
} from 'react-bootstrap';
import { useTranslation, Trans } from "react-i18next";
import { saveAs } from 'file-saver';


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
import NormalButton from "../../../component/NormalButton";
import styled from "@emotion/styled/macro";

import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';

mapboxgl.accessToken =
    'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';


const ShowWrapper = styled.div(
    props => (
        {
            display: props.isShow ? 'inline-block' : 'none',
            width: "100%"
        }
    )
)

const FlexContainer = styled.div(
    props => (
        {
            display: 'flex',
            marginTop: '20px',
            marginLeft: '0px',
            marginRight: '20px'
        }
    )
)

const FlexWrapper = styled.div(
    props => (
        {
            width: props.flex,
            marginRight: props.marginRight,
        }
    )
)

const InputWrapper = styled.div(
    props => (
        {
            borderRadius: "5px",
            display: 'flex',
            backgroundColor: "#6465688e",
            alignItems: 'flex-start',
            flexFlow: '1',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: "5px",
            paddingRight: "5px",
            marginTop: "5px",

        }
    )
)

const StyledInput = styled.input(
    props => (
        {
            alignSelf: "center",
            padding: "50px",
            width: '20px',
            height: '20px',
            flexShrink: '0',
            marginRight: "5px"
        }
    )
)

const StyledLabel = styled.label(
    props => (
        {
        }
    )
)


export const LogLatContainer = styled.div(
    props => (
        {
            position: "fixed",
            top: '3.5rem',
            right: 0,
            maxWidth: '500px',
            padding: "20px 20px 20px 20px",
            zIndex: 2,
            margin: "0 auto"
        }
    )
)

export const LogLatBar = styled.div(
    props => (
        {
            display: 'flex',
            padding: "15px",
            overflow: "hidden",
            borderRadius: "0px",
            backgroundColor: "#001233AA",
            alignSelf: "center",
            fontSize: "1rem",
            display: "flex",
            flexDirection: "column"
        }
    )
)

export function CheckItem({ data, onChange }) {
    return (
        <InputWrapper>
            <StyledInput
                type="checkbox"
                checked={data.value}
                onChange={onChange}
            />
            <StyledLabel>
                {data.name}
            </StyledLabel>
        </InputWrapper>
    )
}

function Layer({ map, mapIsLoad }) {

    const { t, i18n } = useTranslation();
    const [currentData, setCurrentData] = useState(0)

    //雲林
    const [ylchecked, setylChecked] = useState([
        {
            id: 1,
            name: "108雲林地區地層下陷加密水準檢測成果表",
            value: false,
            data: yljsonData1,
            type: "geojson",
            isLoaded: false

        },
        {
            id: 2,
            name: "108雲林地區地層下陷水準檢測成果表",
            value: false,
            data: yljsonData2,
            type: "geojson",
            isLoaded: false

        },
        {
            id: 3,
            name: "GPS站_雲林縣",
            value: false,
            data: yljsonData3,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 4,
            name: "台灣自來水公司第五區_雲林抽水井位置圖",
            value: false,
            data: yljsonData4,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 5,
            name: "地層下陷監測點_雲林縣",
            value: false,
            data: yljsonData5,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 6,
            name: "水準樁_雲林縣",
            value: false,
            data: yljsonData6,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 7,
            name: "雲林水利會抽水井位置圖",
            value: false,
            data: yljsonData7,
            type: "geojson",
            isLoaded: false
        }
    ])
    const OnYunlinListItemsChange = (e, data, index) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        if (value) {
            map.current.setLayoutProperty(data.name, 'visibility', 'visible')
            data.value = value
        } else {
            map.current.setLayoutProperty(data.name, 'visibility', 'none')
            data.value = value
        }
        let newArr = [...ylchecked]
        newArr[index] = data
        setylChecked(newArr)
    }
    let YunlinListItems = ylchecked.map((data, index) =>
        <CheckItem data={data} onChange={(e) => OnYunlinListItemsChange(e, data, index)} />
    );

    //彰化
    const [zhchecked, setzhChecked] = useState([
        {
            id: 1,
            name: "108彰化地區地層下陷加密水準檢測成果表",
            value: false,
            data: zhjsonData1,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 2,
            name: "108彰化地區地層下陷水準檢測成果表",
            value: false,
            data: zhjsonData2,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 3,
            name: "GPS站_彰化縣",
            value: false,
            data: zhjsonData3,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 4,
            name: "台灣自來水公司第十一區_彰化抽水井位置圖",
            value: false,
            data: zhjsonData4,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 5,
            name: "地層下陷監測點_彰化縣",
            value: false,
            data: zhjsonData5,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 6,
            name: "彰化水利會抽水井位置圖",
            value: false,
            data: zhjsonData6,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 7,
            name: "水準樁_彰化縣",
            value: false,
            data: zhjsonData7,
            type: "geojson",
            isLoaded: false
        }
    ])
    const OnChanghuaListItemsChange = (e, data, index) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        if (value) {
            map.current.setLayoutProperty(data.name, 'visibility', 'visible')
            data.value = value
        } else {
            map.current.setLayoutProperty(data.name, 'visibility', 'none')
            data.value = value
        }
        let newArr = [...zhchecked]
        newArr[index] = data
        setzhChecked(newArr)
    }
    let ChanghuaListItems = zhchecked.map((data, index) =>
        <CheckItem data={data} onChange={(e) => OnChanghuaListItemsChange(e, data, index)} />
    );

    //衛星
    const [satellitechecked, setsatelliteChecked] = useState([
        {
            id: 1,
            name: "gpsdata",
            value: false,
            data: gpsdata,
            type: "geojson",
            isLoaded: false
        },
        {
            id: 2,
            name: "GNSS",
            value: false,
            data: GNSS,
            type: "geojson",
            isLoaded: false
        }
    ])
    const OnSatelliteListItemsChange = (e, data, index) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        if (value) {
            map.current.setLayoutProperty(data.name, 'visibility', 'visible')
            data.value = value
        } else {
            map.current.setLayoutProperty(data.name, 'visibility', 'none')
            data.value = value
        }
        let newArr = [...satellitechecked]
        newArr[index] = data
        setsatelliteChecked(newArr)
    }
    let SatelliteListItems = satellitechecked.map((data, index) =>
        <CheckItem data={data} onChange={(e) => OnSatelliteListItemsChange(e, data, index)} />
    );

    useEffect(() => {
        if (mapIsLoad) {
            let newArr = ylchecked
            ylchecked.forEach((d, index) => {
                if (!d.isLoaded) {
                    newArr[index].isLoaded = true
                    map.current.addSource(d.name, {
                        'type': 'geojson',
                        'data': d.data
                    })
                    map.current.addLayer({
                        'id': d.name,
                        'type': 'circle',
                        'source': d.name,
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#f72585'
                        },
                        'filter': ['==', '$type', 'Point']
                    });
                    map.current.on('mouseenter', d.name, function () {
                        map.current.getCanvas().style.cursor = 'pointer';
                    });
                    if (d.value) {
                        map.current.setLayoutProperty(d.name, 'visibility', 'visible')
                    } else {
                        map.current.setLayoutProperty(d.name, 'visibility', 'none')
                    }
                }
            }
            )
            setylChecked(newArr)
        }
    }, [mapIsLoad])

    useEffect(() => {
        if (mapIsLoad) {
            let newArr = zhchecked
            zhchecked.forEach((d, index) => {
                if (!d.isLoaded) {
                    newArr[index].isLoaded = true
                    map.current.addSource(d.name, {
                        'type': 'geojson',
                        'data': d.data
                    })
                    map.current.addLayer({
                        'id': d.name,
                        'type': 'circle',
                        'source': d.name,
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#888888'
                        },
                        'filter': ['==', '$type', 'Point']
                    });
                    map.current.on('click', d.name, function (e) {
                        var coordinates = e.features[0].geometry.coordinates.slice();
                        var coordinateName = e.features[0].properties.點名;
                        const front = "<h6 style='color:red'>"
                        const back = "</h6>"
                        var otherCoordinates2 = front + "點名:" + coordinateName + back
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(otherCoordinates2)
                            .addTo(map.current);
                    })
                    if (d.value) {
                        map.current.setLayoutProperty(d.name, 'visibility', 'visible')
                    } else {
                        map.current.setLayoutProperty(d.name, 'visibility', 'none')
                    }
                }

            }
            )
            setzhChecked(newArr)
        }

    }, [mapIsLoad])

    useEffect(() => {
        if (mapIsLoad) {
            let newArr = satellitechecked
            satellitechecked.forEach((d, index) => {
                if (!d.isLoaded) {
                    newArr[index].isLoaded = true
                    map.current.addSource(d.name, {
                        'type': 'geojson',
                        'data': d.data
                    })
                    map.current.addLayer({
                        'id': d.name,
                        'type': 'circle',
                        'source': d.name,
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#f77777'
                        },
                        'filter': ['==', '$type', 'Point']
                    });
                    map.current.on('click', d.name, function (e) {
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
                    if (d.value) {
                        map.current.setLayoutProperty(d.name, 'visibility', 'visible')
                    } else {
                        map.current.setLayoutProperty(d.name, 'visibility', 'none')
                    }
                }
            }
            )
            setsatelliteChecked(newArr)
        }
    }, [mapIsLoad])


    const [mapData, setMapData] = useState([
        {
            "id": 0,
            "name": "雲林",
        },
        {
            "id": 1,
            "name": "彰化",
        },
        {
            "id": 2,
            "name": "衛星影像",
        }
    ], [])

    let BtnList = mapData.map((data, index) =>
        <NormalButton className={styles.btn_list} isLightOn={currentData === data.id} text={data.name} onClick={(e) => setCurrentData(data.id)} />
    );

    return (
        <div>
            <h4 className={styles.func_title}>{t('layer')}</h4>
            <FlexContainer>
                <FlexWrapper flex={"30%"} marginRight={"20px"}>
                    {BtnList}
                </FlexWrapper>
                <FlexWrapper flex={"70%"}>
                    {currentData == 0 && YunlinListItems}
                    {currentData == 1 && ChanghuaListItems}
                    {currentData == 2 && SatelliteListItems}
                </FlexWrapper>
            </FlexContainer>
        </div>
    )


}



const FormItem = styled.div(
    props => ({
        padding: "10px 10px 10px 0px",
    })
)

const FormItemContainer = styled.div(
    props => ({
        display: "flex",
        flexDirection: "row"
    })
)


function Print({ map, mapIsLoad }) {
    const { t, i18n } = useTranslation();
    const [unit, setUnit] = useState("inch")
    const [format, setForamt] = useState("PNG")


    const onChangeUnit = (e) => {
        setUnit(e.target.value);
    }

    const onChangeFormat = (e) => {
        setForamt(e.target.value);
    }


    const createPrintMap = () => {
        map.current.once('idle', function () {
            map.current.getCanvas().toBlob(function (blob) {
                saveAs(blob, 'map.png');
            });
        })
    }

    const onBtnClick = () => {
        createPrintMap()
    }


    return (
        <div>
            <h4 className={styles.func_title}>{t('print')}</h4>
            <Form>
                <FormItem>
                    <h5>單位</h5>
                    <FormItemContainer>
                        <Form.Check
                            type={'radio'}
                            label={'英吋'}
                            id={`inch`}
                            value={"inch"}
                            checked={unit === "inch"}
                            onChange={onChangeUnit}
                        />
                        <Form.Check
                            className="ml-3"
                            type={'radio'}
                            label={'公尺'}
                            id={`millimeter`}
                            value={"millimeter"}
                            checked={unit === "millimeter"}
                            onChange={onChangeUnit}
                        />
                    </FormItemContainer>
                </FormItem>

                <FormItem>
                    <h5>輸出格式</h5>
                    <FormItemContainer>
                        <Form.Check
                            type={'radio'}
                            label={'PNG'}
                            id={`PNG`}
                            value={"PNG"}
                            checked={format === "PNG"}
                            onChange={onChangeFormat}
                        />
                        <Form.Check
                            className="ml-3"
                            type={'radio'}
                            label={'PDF'}
                            id={`PDF`}
                            value={"PDF"}
                            checked={format === "PDF"}
                            onChange={onChangeFormat}
                        />
                    </FormItemContainer>
                </FormItem>


                <Button onClick={onBtnClick}>輸出</Button>
            </Form>
        </div>
    )
}


function Search(){
    const { t, i18n } = useTranslation();
    return(
        <h4 className={styles.func_title}>{t('search')}</h4>
    )
}

function CircleAnalysis(){
    const { t, i18n } = useTranslation();
    return(
        <h4 className={styles.func_title}>{t('circle_analysis')}</h4>
    )
}

function Locate(){
    const { t, i18n } = useTranslation();
    return(
        <h4 className={styles.func_title}>{t('locate')}</h4>
    )
}

export default function HydraMap() {

    const { t, i18n } = useTranslation();

    const mapContainer = useRef();
    const map = useRef(null);
    const [mapIsLoad, setMapIsLoad] = useState(false)


    const [lng, setLng] = useState(121)
    const [lat, setLat] = useState(24)
    const [zoom, setZoom] = useState(7)
    const [currentFunction, setCurrentFunction] = useState(0)

    const [openSheet, setOpenSheet] = useState(false)

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

        map.current.on('load', function () {
            // ALL YOUR APPLICATION CODE
            console.log("load")
            setMapIsLoad(true)

        });

        return () => map.current.remove();
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });


    const functionChangeToggle = ((funcID) => {
        if (openSheet && currentFunction == funcID) {
            setOpenSheet(false)
        } else {
            setOpenSheet(true)
        }
        setCurrentFunction(funcID)
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
                                        {t('search')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(0)}
                                    icon={faSearch}
                                    size="lg" color="white" id='app-icon' />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        {t('layer')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(1)}
                                    icon={faClone}
                                    size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        {t('3D_switch')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(2)}
                                    icon={faExchangeAlt}
                                    size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        {t('circle_analysis')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(3)}
                                    icon={faStreetView}
                                    size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        {t('print')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(4)}
                                    icon={faPrint}
                                    size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                        <li className={styles.menu_btn_wrapper}>
                            <OverlayTrigger
                                key='right'
                                placement='right'
                                overlay={
                                    <Tooltip id='tooltip-right' className={styles.tooltip}>
                                        {t('locate')}
                                    </Tooltip>
                                }>
                                <FontAwesomeIcon className={styles.menu_btn} onClick={(e) => functionChangeToggle(5)}
                                    icon={faMapMarker} size="lg" color="white" />
                            </OverlayTrigger>
                        </li>
                    </ul>
                </nav>
            </div>

            <ShowWrapper isShow={openSheet}>
                <div className={styles.menu_desk_outer_layer}>
                    <ShowWrapper isShow={currentFunction === 0}>
                        <Search/>
                    </ShowWrapper>
                    <ShowWrapper isShow={currentFunction === 1}>
                        <Layer map={map} mapIsLoad={mapIsLoad} />
                    </ShowWrapper>
                    <ShowWrapper isShow={currentFunction === 2}>
                        <h4 className={styles.func_title}>{t('3D_switch')}</h4>
                    </ShowWrapper>
                    <ShowWrapper isShow={currentFunction === 3}>
                        <CircleAnalysis/>
                    </ShowWrapper>
                    <ShowWrapper isShow={currentFunction === 4}>
                        <Print map={map} mapIsLoad={mapIsLoad} />
                    </ShowWrapper>
                    <ShowWrapper isShow={currentFunction === 5}>
                        <Locate/>
                    </ShowWrapper>
                </div>
            </ShowWrapper>

            <div className={styles.fragment}>
                <div>
                    <LogLatContainer>
                        <LogLatBar>
                            <p>經度：{lng}</p>
                            <p>緯度：{lat}</p>
                            <p>縮放：{zoom}</p>
                        </LogLatBar>
                    </LogLatContainer>
                </div>
                <div className={styles.map} id="map">
                    <div className={styles.map_container} ref={mapContainer} />
                </div>
            </div>
        </>
    )
}