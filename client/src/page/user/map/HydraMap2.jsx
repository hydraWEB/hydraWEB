import React, { DrawCircle, useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPrint,
  faMapMarker,
  faSearch,
  faExchangeAlt,
  faClone,
  faStreetView,
  faPen,
  faRuler,
  faWater,
  faInfo
} from '@fortawesome/free-solid-svg-icons'
import {
  Container,
  OverlayTrigger, Tooltip,
  Row, Col, Image
} from 'react-bootstrap';
import { useTranslation, Trans } from "react-i18next";

import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";

import { DeckGL } from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

import Layer from "./LayerV2.jsx"
import Print from "./Print.jsx"
import Search from "./Search"
import CircleAnalysis from "./CircleAnalysis"
import Chart from "./Chart.jsx"
import Measurement from "./Measurement"
import WaterLevel from "./WaterLevelV2"
import Info from "./Info"
import { FlyToInterpolator } from 'deck.gl';
import StyleJson from './style.json'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ExploreIcon from '@material-ui/icons/Explore';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';


import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';

import {
  EditableGeoJsonLayer,
  ViewMode,
  DrawCircleFromCenterMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode
} from "nebula.gl";

const FabIcon = withStyles({
  root: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  expanded: {},
})(Fab);

const ShowWrapper = styled.div(
  props => (
    {
      display: props.isShow ? 'inline-block' : 'none',
    }
  )
)
const MenuBtnWrapper = styled.div(
  props => (
    {
      background: props.isShow ? '#92a4e4' : null,
      cursor: 'pointer'
    }
  )
)

export const LogLatContainer = styled.div(
  props => (
    {
      position: "fixed",
      top: '3.5rem',
      right: 0,
      padding: "0px",
      zIndex: 2,
      margin: "0 auto"
    }
  )
)

export const LogLatBar = styled.div(
  props => (
    {
      display: 'flex',
      padding: "5px",
      overflow: "hidden",
      borderRadius: "0px",
      backgroundColor: "#001233AA",
      alignSelf: "center",
      fontSize: "0.85rem",
      display: "flex",
      flexDirection: "row",
    }
  )
)


export function distance(lon1, lat1, lon2, lat2) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344
    return dist;
  }
}

function renderTooltip({ hoverInfo }) {
  const { object, x, y } = hoverInfo;

  if (!object) {
    return null;
  }

  const props = object.properties;

  const list = Object.entries(props).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if (key === 'prop1') {
        const list2 = Object.entries(value).map(([key2, value2]) => {
          return (
            <div>{key2} : {value2.toString()}</div>
          )
        })
        return (
          <div>
            <div>{list2}</div>
          </div>
        )
      }
    } else {
      return (
        <div>{key} : {value.toString()}</div>
      );
    }

  })

  return (
    <div className={styles.map_tooltip} style={{ left: x, top: y, zIndex: 10 }}>
      <div className={styles.tooltip_title_mouse}>
        <p className={styles.tooltip_title_t1}>{hoverInfo.object.properties.measurement}</p>
        <p className={styles.tooltip_title_t2}>{hoverInfo.layer.id}</p>
      </div>

      <p className={styles.tooltip_content}>
        {list}
      </p>
    </div>
  );
}

function renderInfo(clickInfo, setClickInfo,setCurrentFunction,waterLevelRef,STNO,setSTNO) {
  if (!clickInfo) {
    return null;
  }
  const { object, x, y } = clickInfo;

  if (!object) {
    return null;
  }

  const props = object.properties;
  
  function GetClickSTNO(){
    if (STNO !== props.measurement) {
      if(clickInfo.layer.id === "地下水觀測井位置圖_雲林縣現存站" || clickInfo.layer.id === "地下水觀測井位置圖_彰化縣現存站"){
        setSTNO(props.measurement)
      }
    }
    return <div/>
  }

  function ShowGroundButton() {
    const [showChart, setShowChart] = React.useState(false)

    if (clickInfo.layer.props.data_type === "Geology") {
      return (
        <div>
          <Button onClick={(e) => { setShowChart(true) }} >
            地質鑽探資料
          </Button>
          <Chart showChart={showChart} setShowChart={setShowChart} chartData={props} />
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  function ShowWaterButton() {
    if (clickInfo.layer.props.data_type === "yunlin" || clickInfo.layer.props.data_type === "changhua" ) {
      if (clickInfo.layer.id === "地下水觀測井位置圖_雲林縣現存站" || clickInfo.layer.id === "地下水觀測井位置圖_彰化縣現存站"){
        // react hook call function outside component
        return (
          <div>
            <Button onClick={(e) => { 
              setCurrentFunction(7);
              //waterLevelRef.current.onSearchClick(e);
              if(document.getElementById('seachClickTrigger') != null){
                
                document.getElementById('seachClickTrigger').click()
              }
              }} >
              水位資料
            </Button>
          </div>
        )
      }
    }
  return <div/>

  }

  const list = Object.entries(props).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if (key === 'prop1') {
        const list2 = Object.entries(value).map(([key2, value2]) => {
          return (
            <div>
              {key2} : {value2.toString()}
            </div>
          )
        })

        return (
          <div>
            <div>{list2}</div>
          </div>
        )
      }
    } else {
      return (
        <div>{key} : {value.toString()}
        </div>
      );
    }

  })

  return (
    <div className={styles.map_tooltip2} style={{ bottom: 10, right: 10, zIndex: 10 }}>
      <div className={styles.tooltip_title}>
        <div className={styles.info_div1}>
          <IconButton onClick={(e) => setClickInfo(null)} >
            <CloseIcon />
          </IconButton>
        </div>
        <p className={styles.tooltip_title_t1}>{clickInfo.object.properties.measurement}</p>

        <p className={styles.tooltip_title_t2}>{clickInfo.layer.id}</p>
        <GetClickSTNO/>
        <ShowGroundButton />
        <ShowWaterButton />
      </div>

      <p className={styles.tooltip_content_2}>
        {list}
      </p>

    </div>
  );
}

//右鍵選單
function ContextMenu({ parentRef, lastClick, startCircleAnalysis, setCurrentFunction }) {
  const [isVisible, setVisibility] = useState(false);
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) {
      return;
    }
    const showMenu = (e) => {
      e.preventDefault();
      setVisibility(true)
      setX(e.clientX)
      setY(e.clientY)
    }
    const hideMenu = (e) => {
      setVisibility(false)
    }
    parent.addEventListener('contextmenu', showMenu);
    parent.addEventListener('click', hideMenu);
    return () => {
      parent.removeEventListener('contextmenu', showMenu);
      parent.removeEventListener('click', hideMenu);
    }
  });

  function startCircleAnalysisFunc(e) {
    setCurrentFunction(3)
    setVisibility(false)
    startCircleAnalysis()
  }

  return isVisible ? <div>
    <div style={{ left: x, top: y, zIndex: 10 }} className={styles.context_menu}>
      <div className={styles.context_menu_item_container}>
        <p className={styles.context_menu_item_text}>x：{lastClick[0]}</p>
      </div>
      <div className={styles.context_menu_item_container}>
        <p className={styles.context_menu_item_text}>y：{lastClick[1]}</p>
      </div>
      <div className={styles.context_menu_item_container} onClick={startCircleAnalysisFunc}>
        <p className={styles.context_menu_item_text}>{t('circle_analysis')}</p>
      </div>
    </div>
  </div> : null
}

export default function HydraMap() {

  const INITIAL_VIEW_STATE = {
    longitude: 120.113924,
    latitude: 23.898837,
    zoom: 7,
    pitch: 0,
    bearing: 0,
    preserveDrawingBuffer: true
  };

  const [selectedFeatureIndexes] = React.useState([]);
  const [radius, setRadius] = useState(0)


  const [circleAnalysisMode, _setCircleAnalysisMode] = useState(() => ViewMode)
  const circleAnalysisModeRef = useRef(circleAnalysisMode);
  const setCircleAnalysisMode = data => {
    circleAnalysisModeRef.current = data;
    _setCircleAnalysisMode(data);
  };

  const [measurementMode, _setMeasurementMode] = useState(() => ViewMode)
  const measurementModeRef = useRef(measurementMode);
  const setMeasurementMode = data => {
    measurementModeRef.current = data;
    _setMeasurementMode(data);
  };    //及時更改

  const [waterLevelMode, _setWaterLevelMode] = useState()
  const waterLevelModeRef = useRef(waterLevelMode);
  const setWaterLevelModeRef = data => {
    waterLevelMode.current = data;
    _setWaterLevelMode(data);
  }



  const [lastClick, _setLastClick] = useState([])
  const lastClickRef = useRef(lastClick);
  const setLastClick = data => {
    lastClickRef.current = data;
    _setLastClick(data);
  };


  const circleAnalysisLayer = new EditableGeoJsonLayer({
    id: "circle-analysis-layer",
    data: {
      type: "FeatureCollection",
      features: []
    },
    mode: circleAnalysisMode,
    selectedFeatureIndexes,
    onEdit: onEdit
  });

  const measurementLayer = new EditableGeoJsonLayer({
    id: "measurement-layer",
    data: {
      type: "FeatureCollection",
      features: []
    },
    mode: measurementMode,
    selectedFeatureIndexes,
    onEdit: onEdit,
    modeConfig: {
      formatTooltip: (distance) => parseFloat(distance).toFixed(2) + "units",
    },
  });

  const drawLayer = new EditableGeoJsonLayer({
    id: "draw-layer",
    data: {
      type: "FeatureCollection",
      features: []
    },
    mode: circleAnalysisMode,
    selectedFeatureIndexes,
    onEdit: onEdit
  });


  const containerRef = useRef()
  const mapRef = useRef()
  const deckRef = useRef()
  const waterLevelRef = useRef(); //waterLevelRef.current.onSearchClick
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';
  const { t, i18n } = useTranslation();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const viewState2 = useRef(INITIAL_VIEW_STATE);
  const [STNO, setSTNO] = useState()
  const [currentFunction, setCurrentFunction] = useState(1)
  const [openSheet, setOpenSheet] = useState(true)
  const [hoverInfo, setHoverInfo] = useState({});
  const [clickInfo, setClickInfo] = useState(null);
  const [allData, setAllData] = useState([]) //地圖顯示Data
  const [chartIsVisible, setChartIsVisible] = useState(false)
  const [layers, setLayers] = useState([circleAnalysisLayer, measurementLayer, drawLayer])
  const [showChart, setShowChart] = useState(false)

  const zoomToLocation = (geometry) => {
    setViewState({
      longitude: geometry.coordinates[0],
      latitude: geometry.coordinates[1],
      zoom: viewState['zoom'],
      bearing: 0,
      pitch: viewState['pitch'],
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ speed: 2000 })
    })
  }

  const setLayersFunc = (layer) => {
    setLayers(layer)
  }

  const functionChangeToggle = ((funcID) => {
    if (openSheet && currentFunction == funcID) {
      setOpenSheet(false)
    } else {
      setOpenSheet(true)
    }
    setCurrentFunction(funcID)
  })

  const onViewStateChange = React.useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  function handleViewStateChange({ viewState: nextViewState }) {
    viewState2.current = nextViewState
  }


  const setHoverInfoFunc = (data) => {
    setHoverInfo(data)
  }

  const setClickInfoFunc = (data) => {
    /*     setViewState(
          {
            longitude: data.object.geometry.coordinates[0],
            latitude: data.object.geometry.coordinates[1],
            zoom: 10,
            bearing: 0,
            pitch: viewState['pitch'],
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator({ speed: 2000 })
    
          }
        ) */
    setClickInfo(data)
  }

  const setClickMapFunc = (data) => {
    if (clickInfo != null) {
      setClickInfo(null)
    }
  }


  function getCursor() {
    layers.forEach((element, i) => {
      if (element.props.id === "circle-analysis-layer") {
        element.getCursor.bind(element)
      }
      if (element.props.id === "measurement-layer") {
        element.getCursor.bind(element)
      }
    })
  }

  function onEdit({ updatedData, editType, featureIndexes, editContext }) {

    let newLayer = [...layers]
    newLayer.forEach((element, i) => {
      if (element.props.id == "circle-analysis-layer") {
        if (updatedData.features.length > 0) {
          setCircleAnalysisMode(() => ViewMode)
          let d = distance(lastClickRef.current[0], lastClickRef.current[1], updatedData.features[0].geometry.coordinates[0][0][0], updatedData.features[0].geometry.coordinates[0][0][1])
          setRadius(d)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "circle-analysis-layer",
            data: updatedData,
            mode: ViewMode,
            selectedFeatureIndexes,
            onEdit: onEdit
          });
        } else {
          newLayer[i] = new EditableGeoJsonLayer({
            id: "circle-analysis-layer",
            data: updatedData,
            mode: circleAnalysisModeRef.current,
            selectedFeatureIndexes,
            onEdit: onEdit
          });
        }

      }
      if (element.props.id == "measurement-layer") {
        if (updatedData.features.length > 0) {
          setMeasurementMode(() => ViewMode)
          let d = distance(lastClickRef.current[0], lastClickRef.current[1], updatedData.features[0].geometry.coordinates[0][0][0], updatedData.features[0].geometry.coordinates[0][0][1])
          setRadius(d)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "measurement-layer",
            data: updatedData,
            mode: ViewMode,
            selectedFeatureIndexes,
            onEdit: onEdit
          });
        } else {
          newLayer[i] = new EditableGeoJsonLayer({
            id: "measurement-layer",
            data: updatedData,
            mode: measurementModeRef.current,
            selectedFeatureIndexes,
            onEdit: onEdit
          });
        }

      }
    })
    setLayers(newLayer)
  }

  const setEditLayerMode = (m) => {
    let newLayer = [...layers]
    newLayer.forEach((element, i) => {
      if (element.props.id == "circle-analysis-layer") {
        if (m === DrawCircleFromCenterMode) {
          setCircleAnalysisMode(() => m)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "circle-analysis-layer",
            data: {
              type: "FeatureCollection",
              features: []
            },
            selectedFeatureIndexes,
            mode: m,
            onEdit: onEdit
          });
        } else {
          setCircleAnalysisMode(() => ViewMode)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "circle-analysis-layer",
            data: element.props.data,
            selectedFeatureIndexes,
            mode: ViewMode,
            onEdit: onEdit
          });
        }

      }
      if (element.props.id == "measurement-layer") {
        if (m === MeasureDistanceMode || m === MeasureAreaMode || m === MeasureAngleMode) {
          setMeasurementMode(() => m)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "measurement-layer",
            data: {
              type: "FeatureCollection",
              features: []
            },
            selectedFeatureIndexes,
            mode: m,
            onEdit: onEdit
          });
        } else {
          setMeasurementMode(() => ViewMode)
          newLayer[i] = new EditableGeoJsonLayer({
            id: "measurement-layer",
            data: element.props.data,
            selectedFeatureIndexes,
            mode: ViewMode,
            onEdit: onEdit
          });
        }

      }
    })
    setLayers(newLayer)
  }

  const saveLastClick = React.useCallback(e => {
    setLastClick([e.coordinate[0], e.coordinate[1]])
  }, [])

  return (
    <>
      <div className={styles.top_level_nav}>
        <nav className={styles.top_level_nav_wrapper}>
            <MenuBtnWrapper isShow={currentFunction === 0 && openSheet == true} onClick={(e) => functionChangeToggle(0)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('search')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn} >
                  <FontAwesomeIcon
                    icon={faSearch}
                    size="lg" color="gray" />
                </div>

              </OverlayTrigger>
            </MenuBtnWrapper>
            <MenuBtnWrapper isShow={currentFunction === 1 && openSheet == true} onClick={(e) => functionChangeToggle(1)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('layer')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn}>
                  <FontAwesomeIcon
                    icon={faClone}
                    size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            <MenuBtnWrapper isShow={currentFunction === 3 && openSheet == true} onClick={(e) => functionChangeToggle(3)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('circle_analysis')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn}>
                  <FontAwesomeIcon
                    icon={faStreetView}
                    size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            <MenuBtnWrapper isShow={currentFunction === 4 && openSheet == true} onClick={(e) => functionChangeToggle(4)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('print')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn} >

                  <FontAwesomeIcon
                    icon={faPrint}
                    size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            <MenuBtnWrapper isShow={currentFunction === 6 && openSheet == true} onClick={(e) => functionChangeToggle(6)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('measurement')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn} >
                  <FontAwesomeIcon
                    icon={faRuler} size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            <MenuBtnWrapper isShow={currentFunction === 7 && openSheet == true} onClick={(e) => functionChangeToggle(7)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('waterlevel')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn} >
                  <FontAwesomeIcon
                    icon={faWater} size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            <div className={styles.menu_btn_bottom}>
            <MenuBtnWrapper isShow={currentFunction === 8 && openSheet == true} onClick={(e) => functionChangeToggle(8)}>
              <OverlayTrigger
                key='right'
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right' className={styles.tooltip}>
                    {t('info')}
                  </Tooltip>
                }>
                <div className={styles.menu_btn} >
                  <FontAwesomeIcon
                    icon={faInfo} size="lg" color="gray" />
                </div>
              </OverlayTrigger>
            </MenuBtnWrapper>
            </div>

        </nav>

                
        <ShowWrapper isShow={openSheet}>
          <ShowWrapper isShow={currentFunction === 0}>
            <div className={styles.menu_desk_outer_layer}>
              <Search allData={allData} setAllData={setAllData} layers={layers} setLayers={setLayersFunc} zoomTo={zoomToLocation} setHoverInfo={setHoverInfoFunc} setClickInfo={setClickInfoFunc} />
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 1}>
            <div className={styles.menu_desk_outer_layer}>
              <Layer allData={allData} setAllData={setAllData} layers={layers} setLayers={setLayersFunc} setHoverInfo={setHoverInfoFunc} setClickInfo={setClickInfoFunc} setChartIsVisible={setChartIsVisible} />
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 3}>
            <div className={styles.menu_desk_outer_layer}>
              <CircleAnalysis radius={radius} setRadius={setRadius} setAllData={setAllData} allData={allData} layers={layers} setLayers={setLayersFunc} mode={circleAnalysisMode} setMode={setEditLayerMode} lastClick={lastClick} zoomTo={zoomToLocation} setHoverInfo={setHoverInfoFunc} setClickInfo={setClickInfoFunc} />
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 4}>
            <div className={styles.menu_desk_outer_layer}>
              <Print map={mapRef} deck={deckRef} />
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 6}>
            <div className={styles.menu_desk_outer_layer}>
              <Measurement mode={measurementMode} setMode={setEditLayerMode} />
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 7}>
            <div className={styles.menu_desk_outer_layer_2}>
              <WaterLevel ref={waterLevelRef} STNO={STNO}/>
            </div>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 8}>
            <div className={styles.menu_desk_outer_layer}>
              <Info/>
            </div>
          </ShowWrapper>
        </ShowWrapper>

      </div>





      <div className={styles.fragment}>
        <div>
          <LogLatContainer>
            <LogLatBar>
              <p className={styles.loglat}>{`EPSG 4326`}</p>
              <p className={styles.loglat}>{t('longitude')}{`：${viewState['longitude'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{t('latitude')}{`：${viewState['latitude'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{t('zoom')}{`：${viewState['zoom'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{t('angle')}{`：${viewState['pitch'].toFixed(6)}`}</p>
            </LogLatBar>
          </LogLatContainer>
        </div>
        <div className={styles.zoomIn_btn}>
          <FabIcon color="light" onClick={(e) => {
            setViewState({
              longitude: viewState['longitude'],
              latitude: viewState['latitude'],
              zoom: viewState['zoom'] + 1.0,
              pitch: viewState['pitch'],
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator({ speed: 5000 })
            })
          }}>
            <AddIcon />
          </FabIcon>
          <FabIcon color="light" onClick={(e) => {
            setViewState({
              longitude: viewState['longitude'],
              latitude: viewState['latitude'],
              zoom: viewState['zoom'] - 1.0,
              pitch: viewState['pitch'],
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator({ speed: 5000 })
            })
          }}>
            <RemoveIcon />
          </FabIcon>
          <FabIcon color="light" onClick={(e) => {
            setViewState({
              longitude: viewState['longitude'],
              latitude: viewState['latitude'],
              zoom: viewState['zoom'],
              pitch: 0,
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator({ speed: 5000 })
            })
          }}>
            <ExploreIcon />
          </FabIcon>
          <div className={styles.ps_chart_container} >
            {chartIsVisible &&
              <div>
                <img className={styles.ps_chart} src='/img/chart.png' alt="chart" />
                <div className={styles.ps_chart_right_container} >
                  <p className={styles.ps_chart_right_container_text1}>47.3</p>
                  <p className={styles.ps_chart_right_container_text2}>-45.3</p>
                </div>
              </div>
            }


          </div>

        </div>



        <div className={styles.map} id="big_map" ref={containerRef}>
          <DeckGL
            tooltip={true}
            /*          initialViewState={INITIAL_VIEW_STATE}
             */
            viewState={viewState}
            onViewStateChange={onViewStateChange}
            controller={{
              doubleClickZoom: false
            }}
            layers={[layers]}
            ref={deckRef}
            getCursor={getCursor}
            onClick={saveLastClick}
          >
            <StaticMap ref={mapRef} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} reuseMaps preventStyleDiffing={true} mapStyle={StyleJson} preserveDrawingBuffer={true} />
            {renderTooltip({ hoverInfo })}
          </DeckGL>
        </div>
        <ContextMenu parentRef={containerRef} lastClick={lastClick} startCircleAnalysis={() => { setEditLayerMode(DrawCircleFromCenterMode) }} setCurrentFunction={setCurrentFunction} />
        {renderInfo(clickInfo, setClickInfo, setCurrentFunction ,waterLevelRef,STNO,setSTNO)}
      </div>
    </>

  );
}