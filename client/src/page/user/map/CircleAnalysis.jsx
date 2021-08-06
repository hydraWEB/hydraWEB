import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode
} from "nebula.gl";


export default function CircleAnalysis({allData, layers, setLayers,editLayer,mode,setMode}) {

  const { t, i18n } = useTranslation();

  function setEditLayerMode(mode){
    setMode(mode)
  }

  return (
    <div>
      <h4 className={styles.func_title}>{t('circle_analysis')}
      </h4>
      
      <div>
        <button
          onClick={(e) => setEditLayerMode(() => DrawLineStringMode)}
          style={{ background: mode === DrawLineStringMode ? "#3090e0" : null }}
        >
          Line
        </button>
        <button
          onClick={() => setEditLayerMode(() => DrawPolygonMode)}
          style={{ background: mode === DrawPolygonMode ? "#3090e0" : null }}
        >
          Polygon
        </button>
      </div>

    </div>

  )
}