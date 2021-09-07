import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  ViewMode
} from "nebula.gl";

import { distance } from "./HydraMap2";

export default function CircleAnalysis({ radius, setRadius, allData, layers, setLayers, editLayer, mode, setMode, lastClick }) {

  const { t, i18n } = useTranslation()
  const [searchResult, setsearchResult] = useState([])

  function setEditLayerMode() {
    if(mode == DrawCircleFromCenterMode){
      setMode(ViewMode)
    }else{
      setMode(DrawCircleFromCenterMode)
    }
  }

  function filter() {
    let alldt = allData
    let resultMeasurement = []
    let data = []
    let isValid = false
    if (radius > 0) isValid = true

    if (isValid) {
      for (let i = 0; i < alldt.length; i++) {
        let file = alldt[i].files
        for (let dt = 0; dt < file.length; dt++) {
          let feat = file[dt]
          for (let f = 0; f < feat.data.features.length; f++) {
            let x = feat.data.features[f].geometry.coordinates[0]
            let y = feat.data.features[f].geometry.coordinates[1]
            let rad = distance(lastClick[0], lastClick[1], x, y)
            if (rad <= radius) {
              resultMeasurement.push(feat.data.features[f])
              data.push(file[dt])
            }
          }
        }
      }
    }
    setsearchResult(resultMeasurement)
  }
  function ShowResult(data) {
    let arr = []
    let arrmeasurement = []
    let arrtime = []
    for (var i in data.data.properties) {
      if(i.indexOf("prop") >= 0){
        arr.push(i)
        arr.push(" : ")
        arr.push(", ")
        for (let k in data.data.properties[i]){
          arr.push(k)
          arr.push(" : ")
          arr.push(data.data.properties[i][k])
          arr.push(", ")
        }
      }
      else{
        if (i !== "TWD97_X" && i !== "TWD97_Y" && i !== "time_series" && i !== "measurement" && i !== "time") {
          arr.push(i)
          arr.push(" : ")
          arr.push(data.data.properties[i])
          arr.push(", ")
        }
        else if (i === "measurement") {
          arrmeasurement.push(data.data.properties[i])
        }
        else if (i === "time") {
          let dayjs = require("dayjs")
          arrtime.push(dayjs(data.data.properties[i]).format('YYYY/MM/DD'))
        }
      }
      
    }
    return (
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{arrmeasurement}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <p>{arr}</p>
              <p>{arrtime}</p>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    )
  }

  let resultlist = searchResult.map((d) =>
    <ShowResult data={d} />
  );

  useEffect(() => {
    filter()
  }, [radius])





  return (
    <div>
      <h4 className={styles.func_title}>{t('circle_analysis')}
      </h4>

      <div>
        <div className={styles.circleAnalysis_top}>
          <p>{t('radius')}：{radius}km</p>
          {lastClick.length > 1 &&
            <p>{t('center_point')}：{lastClick[0]}, {lastClick[1]}</p>

          }
          <div className={styles.circle_analysis_btn}>
            <Button
              onClick={(e) => setEditLayerMode()}
              variant={mode == DrawCircleFromCenterMode ? "contained" : "outlined"}        >
              {mode == DrawCircleFromCenterMode ? t('cancel_draw_circle') : t('draw_circle')}       
            </Button>
          </div> 
        </div>
        <div className={styles.circleAnalysis_search_result}>
          {resultlist}
        </div>
      </div>

    </div>

  )
}