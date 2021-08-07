import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import Button from '@material-ui/core/Button';

import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  ViewMode
} from "nebula.gl";


export default function CircleAnalysis({allData, layers, setLayers,editLayer,mode,setMode,radius}) {

  const { t, i18n } = useTranslation();

  function setEditLayerMode(mode){
    console.log(mode)
    setMode(mode)
  }

  return (
    <div>
      <h4 className={styles.func_title}>{t('circle_analysis')}
      </h4>
      
      <div>
        <p>半徑：{radius}</p>
        <Button
          onClick={(e) => setEditLayerMode(ViewMode)}
          variant={mode == ViewMode ? "contained" : "outlined"}
        >
          View
        </Button>
        <Button
          onClick={(e) => setEditLayerMode(DrawCircleFromCenterMode)}
          variant={mode == DrawCircleFromCenterMode ? "contained" : "outlined"}        >
          Draw Circle
        </Button>
      </div>

    </div>

  )
}