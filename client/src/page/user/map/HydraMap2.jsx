import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPrint,
  faMapMarker,
  faSearch,
  faExchangeAlt,
  faClone,
  faStreetView,
} from '@fortawesome/free-solid-svg-icons'
import {
  OverlayTrigger, Tooltip, Button, Navbar, Nav, Dropdown, FormControl,
  NavDropdown, ToggleButton, ToggleButtonGroup, InputGroup, Form, ButtonGroup
} from 'react-bootstrap';
import { useTranslation, Trans } from "react-i18next";

import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";

import { DeckGL } from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

import { useToasts } from "react-toast-notifications";

import Layer from "./LayerV2.jsx"
import Print from "./Print.jsx"

const ShowWrapper = styled.div(
  props => (
    {
      display: props.isShow ? 'inline-block' : 'none',
      width: "100%"
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
      flexDirection: "row"
    }
  )
)




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
    <div className={styles.map_tooltip} style={{ left: x, top: y, zIndex: 10 }}>
      <div className={styles.tooltip_title}>
        <p className={styles.tooltip_title_t1}>{hoverInfo.object.properties.measurement}</p>
        <p className={styles.tooltip_title_t2}>{hoverInfo.layer.id}</p>
      </div>

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
  const [currentFunction, setCurrentFunction] = useState(1)
  const [openSheet, setOpenSheet] = useState(true)
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
            <h4 className={styles.func_title}>{t('search')}</h4>
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
              <p className={styles.loglat}>{`EPSG 4326`}</p>
              <p className={styles.loglat}>{`經度：${viewState['longitude'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{`緯度：${viewState['latitude'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{`縮放：${viewState['zoom'].toFixed(6)}`}</p>
              <p className={styles.loglat}>{`角度：${viewState['pitch'].toFixed(6)}`}</p>
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
            glOptions={{ preserveDrawingBuffer: true }}
          >
            <StaticMap ref={mapRef} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
            {renderTooltip({ hoverInfo })}
          </DeckGL>
        </div>
      </div>
    </>

  );
}