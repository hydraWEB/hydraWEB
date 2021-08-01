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
import NormalButton from "../../component/NormalButton";
import styled from "@emotion/styled/macro";

import { DeckGL } from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';


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

function Layer({ layers, setLayers }) {

  const { t, i18n } = useTranslation();
  const [currentData, setCurrentData] = useState(0)
  const [hoverInfo, setHoverInfo] = useState({});

  //雲林
  const [ylchecked, setylChecked] = useState([
    {
      id: 1,
      name: "108雲林地區地層下陷加密水準檢測成果表",
      value: false,
      data: yljsonData1,
      type: "geojson"
    },
    {
      id: 2,
      name: "108雲林地區地層下陷水準檢測成果表",
      value: false,
      data: yljsonData2,
      type: "geojson"
    },
    {
      id: 3,
      name: "GPS站_雲林縣",
      value: false,
      data: yljsonData3,
      type: "geojson"
    },
    {
      id: 4,
      name: "台灣自來水公司第五區_雲林抽水井位置圖",
      value: false,
      data: yljsonData4,
      type: "geojson"
    },
    {
      id: 5,
      name: "地層下陷監測點_雲林縣",
      value: false,
      data: yljsonData5,
      type: "geojson"
    },
    {
      id: 6,
      name: "水準樁_雲林縣",
      value: false,
      data: yljsonData6,
      type: "geojson"
    },
    {
      id: 7,
      name: "雲林水利會抽水井位置圖",
      value: false,
      data: yljsonData7,
      type: "geojson"
    }
  ])
  const OnYunlinListItemsChange = (e, data, index) => { //data是從ylchecked裡取出
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newLayer = [...layers] //複製一個layer
    if (value) { //CheckBox的值
      newLayer.forEach((element, i) => {
        if (element.props.name == data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
          newLayer[i] = new GeoJsonLayer({
            id: data.id,
            name: data.name,
            data: data.data,
            visible: true,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true

          })
        }
      });
    } else {
      newLayer.forEach((element, i) => {
        if (element.props.name == data.name) {
          newLayer[i] = new GeoJsonLayer({
            id: data.id,
            name: data.name,
            data: data.data,
            visible: false,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true

          })
        }
      });
    }
    data.value = value
    let newArr = [...ylchecked]
    newArr[index] = data
    setylChecked(newArr) //修改ylchecked
    setLayers(newLayer) //修改本來地圖的layer
  }
  let YunlinListItems = ylchecked.map((data, index) =>
    <CheckItem data={data} onChange={(e) => OnYunlinListItemsChange(e, data, index)} />
  );


  useEffect(() => {
    let newArr = ylchecked
    let newLayer = []
    ylchecked.forEach((d, index) => {
      newLayer.push(
        new GeoJsonLayer({
          id: d.id,
          name: d.name,
          data: d.data,
          visible: d.value,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          onHover: setHoverInfo,
          getFillColor: [200, 0, 80, 180],
          // Interactive props
          pickable: true,
          autoHighlight: true

        })
      )
    }
    )
    /*   const data = [
        {sourcePosition: [121, 24], targetPosition: [122, 25]}
      ];
      
      newLayer.push(
        new LineLayer({id: 'line-layer',data} )
      ) */
    setLayers(newLayer)
    setylChecked(newArr)
  }, [])


  const [mapData, setMapData] = useState([
    {
      "id": 0,
      "name": "雲林",
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
    const mapRef = map.current.getMap()
    /*     mapRef.getCanvas().toBlob(function (blob) {
          saveAs(blob, 'map.png');
        });  */
    let deckgl = document.getElementById("deck-gl-canvas")
    deck.current.deck.redraw(true)
    let div = document.getElementById("deck-gl-canvas-wrapper");
    div.current.redraw(true)
    // use html2canvas tool to capture the content of the canvas inside the div and download it as an png file
    html2canvas(div).then(canvas => {
      document.body.appendChild(canvas);
      let a = document.createElement('a');
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      a.download = 'screenshot.png';
      a.click();
    });



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
            <Layer layers={layers} setLayers={setLayersFunc} />
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
            id="deck-gl-canvas"
            {...viewState}
            initialViewState={INITIAL_VIEW_STATE}
            onViewStateChange={onViewStateChange}
            controller={true}
            layers={layers}
            ref={deckRef}
          >
            <StaticMap id="map-canvas" ref={mapRef} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
          </DeckGL>
        </div>
      </div>
    </>

  );
}