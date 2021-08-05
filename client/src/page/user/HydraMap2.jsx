import React, { useEffect, useState, useRef } from 'react';
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faCog,
  faDatabase,
  faPrint,
  faMapMarker,
  faTint,
  faSignOutAlt,
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

import gpsdata from '../../utils/gpsdata';
import GNSS from '../../utils/GNSS_WGS84';

import styles from './HydraMap.module.scss';
import NormalButton from "../../component/NormalButton";
import styled from "@emotion/styled/macro";

import { DeckGL } from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LayerList } from '../../lib/api'
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import Slider from '@material-ui/core/Slider';

import TooltipMaterial from '@material-ui/core/Tooltip';
import { DataFilterExtension } from '@deck.gl/extensions';

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

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <TooltipMaterial open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </TooltipMaterial>
  );
}


const hashCode = (str) => { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

const getDotColor = d => {
  let a = hashCode(d.name)
  return [a & 255, (a >> 1) & 255, (a >> 2) & 255]
};


export function CheckItem({ data, currentLayer, setCurrentLayer, onChange, originData }) {

  const [timeList, setTimeList] = useState([])
  const [min, setmin] = useState(0)
  const [max, setmax] = useState(0)
  const [currentSliderValue, setCurrentSliderValue] = useState(0)

  function findminmax(arr) {
    setmin(arr[0].value)
    setmax(arr[arr.length - 1].value)
  }

  useEffect(() => {
    let dayjs = require("dayjs")
    let newTimeList = []
    if (data.time_serie) {
      data.data.features.forEach((element) => {
        newTimeList.push(element.properties.time)
      })
      newTimeList = newTimeList.sort()
      let uniq = []
      let unique = [...new Set(newTimeList)];
      unique.forEach((element) => {
        let time = dayjs(element)
        uniq.push({
          value: time.valueOf()
        })
      })
      setTimeList(uniq)
      findminmax(uniq)
      setCurrentSliderValue(data.current_time)
    }
  }, [data])

  function valueLabelFormat(value) {
    let dayjs = require("dayjs")
    return dayjs(value).format('YYYY/MM/DD')
  }
  
  
  const handleChange = (event, newValue) => {
    setCurrentSliderValue(newValue)
    setCurrentLayer(newValue)
  };

  return (
    <InputWrapper>
      <StyledInput
        type="checkbox"
        checked={data.value}
        onChange={onChange}
      />
      <StyledLabel>
        <div>
          {data.name}
        </div>
        {data.time_serie && <>
          <Slider
            value={currentSliderValue}
            min={min}
            max={max}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={null}
            defaultValue={min}
            marks={timeList}
            onChange={handleChange}
            valueLabelFormat={valueLabelFormat}
            ValueLabelComponent={ValueLabelComponent}
          />
        </>
        }


      </StyledLabel>
    </InputWrapper>
  )
}

function Layer({ layers, setLayers, setHoverInfo }) {

  const { t, i18n } = useTranslation();
  const [originData, setOriginData] = useState([]) //原本的不會修改到的data
  const [AllData, setAllData] = useState([]) //地圖顯示Data
  const [currentDataIdx, setCurrentDataIdx] = useState(0) //選擇的json檔分類
  const [currentSelectedData, setCurrentSelectedData] = useState([]) //右邊列表顯示的json檔

  const onChangeCurrentData = (idx) => {
    setCurrentDataIdx(idx)
    setCurrentSelectedData(AllData[idx].files)
  }

  const onHover = (data) => {
    setHoverInfo(data)
  }

  const getFilterValue = (d) => {
    const dayjs = require("dayjs")
    let time1 = dayjs(d.properties.time)
    console.log("aaa")
    return time1.valueOf()
  }


  const OnListItemsChange = (e, data, index) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newMapData = [...AllData]
    newMapData[currentDataIdx].files[index].value = value
    setAllData(newMapData)
    let newLayer = [...layers] //複製一個layer
    newLayer.forEach((element, i) => {
      if (element.props.name == "ps_mean_v.xy.json") { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        newLayer[i] = new HexagonLayer({
          id: data.name,
          name: data.name,
          data: element.props.data,
          extruded: true,
          pickable: true,
          visible: data.value,
          radius: 1000,
          transitions: {
            elevationScale: 3000
          }
        })
        //return;
      }
      if (element.props.name == data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        if(data.time_serie){
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: data.value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            filterEnabled:false,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,          
            filterRange: [0 , 0],
            // Define extensions
            extensions: [new DataFilterExtension({filterSize: 1,countItems:true})]
          })
        }else{
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
          })
        }
      
      }
    });
    setLayers(newLayer) //修改本來地圖的layer */ 
  }


  useEffect(() => {
    LayerList().then((res) => {
      let list = []
      res.data.data.forEach((element, idx) => {
        console.log(element.name)
        let files = element.file
        files.forEach((element2, idx) => {
          files[idx].value = false //不會先顯示圖層
          files[idx].current_time = 0 //不會先顯示圖層
        })

        list.push({
          "id": idx,
          "name": element.name,
          "files": files,
        })
      })
      setAllData(list)
      setOriginData(list)
      setCurrentSelectedData(list[currentDataIdx].files)

      let newLayer = []
      list.forEach((l, index) => {
        l.files.forEach((data, idx) => {
          if (data.name == "ps_mean_v.xy.json") {
            let hexdata = []
            data.data.features.forEach((dl) => {
              try {
                hexdata.push({ "COORDINATES": [dl.geometry.coordinates[0], dl.geometry.coordinates[1]] })
              } catch (error) {

              }
            })
            newLayer.push(
              new HexagonLayer({
                id: data.value,
                name: data.name,
                visible: false,
                data: hexdata,
                elevationScale: 4,
                visible: data.value,
                extruded: true,
                getPosition: d => d.COORDINATES,
                radius: 200,
              })
            )
            return
          }
          if(data.time_serie){
            newLayer.push(
              new GeoJsonLayer({
                id: data.name,
                name: data.name,
                data: data.data,
                visible: data.value,
                // Styles
                filled: true,
                pointRadiusMinPixels: 2,
                pointRadiusScale: 5,
                getPointRadius: f => 5,
                getFillColor: getDotColor(data),
                // Interactive props
                pickable: true,
                autoHighlight: true,
                onHover: onHover,
                filterEnabled:false,
                getFilterValue: getFilterValue,
                filterTransformSize: true,
                filterTransformColor: true,          
                filterRange: [0 , 0],
                // Define extensions
                extensions: [new DataFilterExtension({filterSize: 1,countItems:true})],
                
              })
            )
          }else{
            newLayer.push(
              new GeoJsonLayer({
                id: data.name,
                name: data.name,
                data: data.data,
                visible: data.value,
                // Styles
                filled: true,
                pointRadiusMinPixels: 2,
                pointRadiusScale: 5,
                getPointRadius: f => 5,
                getFillColor: getDotColor(data),
                // Interactive props
                pickable: true,
                autoHighlight: true,
                onHover: onHover
              }))
          }
         

        })
      })
      setLayers(newLayer)

    }).catch((err) => {

    }).finally(() => {

    })
  }, [])

  function getLayer(data) {
    layers.forEach(element => {
      if (element.props.name === data.name) {
        return element
      }
    })
  }

  function setCurrentLayer(data, time,index) {
    //console.log(layers)
    let newLayer = [...layers] //複製一個layer
    let dayjs = require("dayjs")
    let newMapData = [...AllData]
    newMapData[currentDataIdx].files[index].value = true
    newMapData[currentDataIdx].files[index].current_time = time
    setAllData(newMapData)

    function onFilteredItemsChange(id,count){
      console.log(count)
    }

    newLayer.forEach((element,i) => {
      if (element.props.name === data.name) {
        newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: data.value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            filterEnabled:true,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,          
            filterRange: [time , time],
            onFilteredItemsChange:onFilteredItemsChange,
            // Define extensions
            extensions: [new DataFilterExtension({filterSize: 1,countItems:true})]
          })
      }
    })
    //console.log(time)
    setLayers(newLayer)
  }

  let CurrentListItems = currentSelectedData.map((data, index) =>
    <CheckItem currentLayer={getLayer(data)} setCurrentLayer={(time) => setCurrentLayer(data, time,index)} originData={originData} data={AllData[currentDataIdx].files[index]} onChange={(e) => OnListItemsChange(e, data, index)} />
  );

  let BtnList = AllData.map((data, index) =>
    <NormalButton className={styles.btn_list} isLightOn={currentDataIdx === data.id} text={data.name} onClick={(e) => onChangeCurrentData(index)} />
  );

  return (
    <div>
      <h4 className={styles.func_title}>{t('layer')}</h4>
      <FlexContainer>
        <FlexWrapper flex={"30%"} marginRight={"20px"}>
          {BtnList}
        </FlexWrapper>
        <FlexWrapper flex={"70%"}>
          {CurrentListItems}
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


function Print({ map, deck }) {
  const { t, i18n } = useTranslation();
  const [unit, setUnit] = useState("inch")
  const [format, setForamt] = useState("PNG")

  const onChangeUnit = (e) => {
    setUnit(e.target.value);
  }

  const onChangeFormat = (e) => {
    setForamt(e.target.value);
  }

  const downloadImage = () => {
    const fileName = "Map.png";

    const mapboxCanvas = map.current.getMap().getCanvas(document.getElementById("map-canvas"));
    deck.current.deck.redraw(true);
    const deckglCanvas = document.getElementById("deck-gl-canvas");

    let merge = document.createElement("canvas");
    merge.width = mapboxCanvas.width;
    merge.height = mapboxCanvas.height;

    var context = merge.getContext("2d");

    context.globalAlpha = 1.0;
    context.drawImage(mapboxCanvas, 0, 0);
    context.globalAlpha = 1.0;
    context.drawImage(deckglCanvas, 0, 0);

    merge.toBlob(blob => {
      saveAs(blob, fileName);
    });
  };

  const createPrintMap = () => {
    const html2canvas = require("html2canvas")
    /* const mapRef = map.current.getMap()
    mapRef.getCanvas().toBlob(function (blob) {
          saveAs(blob, 'map.png');
        });    */
    let div = document.getElementById("deck-gl-canvas");
    deck.current.deck.redraw(true)
    html2canvas(div).then(canvas => {
      document.body.appendChild(canvas);
      deck.current.deck.redraw(true)
      let a = document.createElement('a');
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      a.download = 'screenshot.png';
      a.click();
    });

    /*     let div = document.getElementsByClassName("mapboxgl-canvas")[0]
        deck.current.deck.redraw(true)
        div.toBlob(blob => {
          saveAs(blob, "map.png");
        }); */


  }

  const onBtnClick = () => {
    createPrintMap()
    //downloadImage()
  }

  /*    const screenshot = () => {
        let canvas = $scope.scatterLayer.canvas;
          document.body.appendChild(canvas);
          let a = document.createElement('a');
          // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
          a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          a.download = 'screenshot.png';
          a.click();
     } */


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

function renderTooltip({ hoverInfo }) {
  const { object, x, y } = hoverInfo;

  if (!object) {
    return null;
  }

  const props = object.properties;

  const list = Object.entries(props).map(([key, value]) => {
    return (
      <div>{key} : {value.toString()}</div>
    );
  })

  return (
    <div className={styles.tooltip} style={{ left: x, top: y, zIndex: 10 }}>
      <p className={styles.tooltip_title}>
        {hoverInfo.object.properties.measurement}
      </p>
      <p className={styles.tooltip_content}>
        {list}
      </p>
    </div>
  );
}

export default function HydraMap() {

  const INITIAL_VIEW_STATE = {
    longitude: 121,
    latitude: 24,
    zoom: 7,
    pitch: 0,
    bearing: 0
  };

  const mapRef = useRef()
  const deckRef = useRef()
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZmxleG9sayIsImEiOiJja2tvMTIxaDMxNW9vMm5wcnIyMTJ4eGxlIn0.S6Ruq1ZmlrVQNUQ0xsdE9g';
  const { t, i18n } = useTranslation();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [currentFunction, setCurrentFunction] = useState(0)
  const [openSheet, setOpenSheet] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({});

  // Data to be used by the LineLayer

  const data = [
    { sourcePosition: [121, 24], targetPosition: [122, 25] }
  ];

  const [layers, setLayers] = useState([])

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

  const onViewStateChange = (nextViewState) => {
    setViewState(nextViewState['viewState'])
  }

  const setHoverInfoFunc = (data) => {
    setHoverInfo(data)
  }

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
            <div>
              <h4 className={styles.func_title}>{t('search')}</h4>
              <Dropdown classname={styles.droplist}>
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
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 1}>
            <Layer layers={layers} setLayers={setLayersFunc} setHoverInfo={setHoverInfoFunc} />
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 2}>
            <h4 className={styles.func_title}>{t('3D_switch')}</h4>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 3}>
            <h4 className={styles.func_title}>{t('circle_analysis')}</h4>
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 4}>
            <Print map={mapRef} deck={deckRef} />
          </ShowWrapper>
          <ShowWrapper isShow={currentFunction === 5}>
            <h4 className={styles.func_title}>{t('locate')}</h4>
          </ShowWrapper>
        </div>
      </ShowWrapper>

      <div className={styles.fragment}>
        <div>
          <LogLatContainer>
            <LogLatBar>
              <p>經度：{viewState['longitude']}</p>
              <p>緯度：{viewState['latitude']}</p>
              <p>縮放：{viewState['zoom']}</p>
            </LogLatBar>
          </LogLatContainer>
        </div>
        <div className={styles.map} id="map">
          <DeckGL
            tooltip={true}
            id="deck-gl-canvas"
            {...viewState}
            initialViewState={INITIAL_VIEW_STATE}
            onViewStateChange={onViewStateChange}
            controller={true}
            layers={layers}
            ref={deckRef}
          >
            <StaticMap id="map-canvas" ref={mapRef} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
            {renderTooltip({ hoverInfo })}
          </DeckGL>
        </div>
      </div>
    </>

  );
}