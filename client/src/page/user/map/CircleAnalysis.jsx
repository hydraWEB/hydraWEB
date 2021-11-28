import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from "@material-ui/lab/Pagination";

import SearchFunction from './SearchFunction.jsx'

import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  ViewMode
} from "nebula.gl";

import { distance } from "./HydraMap2";


const Accordion = withStyles({
  root: {
    backgroundColor: '#024FA1',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#024FA1',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 20,
    '&$expanded': {
      minHeight: 20,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: 0,
  },
}))(MuiAccordionDetails);



export default function CircleAnalysis({ radius, setRadius, setAllData, allData, layers, setLayers, mode, setMode, lastClick, zoomTo, setHoverInfo, setClickInfo }) {

  const { t, i18n } = useTranslation()
  const [searchResult, setsearchResult] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageData, setCurrentPageData] = useState([])
  const [totalpage, setTotalPage] = useState(0)
  const [data, setData] = useState()
  function setEditLayerMode() {
    if (mode == DrawCircleFromCenterMode) {
      setMode(ViewMode,"circle-analysis-layer")
    } else {
      setMode(DrawCircleFromCenterMode,"circle-analysis-layer")
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
    currentPageDataSetting(resultMeasurement, 1)
    setCurrentPage(1)
    setData(data)
  }


  let resultlist = currentPageData.map((d) =>
    <div>
      {
        d !== undefined &&
        <SearchFunction data={d} zoomTo={zoomTo} allData={allData} setAllData={setAllData} layers={layers}
          setLayers={setLayers} setHoverInfo={setHoverInfo} setClickInfo={setClickInfo} zoomInData={data} />
      }
    </div>
  );

  function currentPageDataSetting(resultMeasurement, page) {
    let totalPage = Math.ceil(resultMeasurement.length / 10)
    let pageData = resultMeasurement.slice((page - 1) * 10, page * 10 - 1)
    setCurrentPageData(pageData)
    setTotalPage(totalPage)
  }

  const onChangePage = (e, page) => {
    currentPageDataSetting(searchResult, page)
    setCurrentPage(page)
  }

  useEffect(() => {
    filter()
  }, [radius])

  return (
    <div>
      <h4 className={styles.func_title}>{t('circle_analysis')}
      </h4>

      <div>
        <div className={styles.function_wrapper_circle_analysis}>
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
        </div>

        <div className={styles.circleAnalysis_search_result}>
          {searchResult.length > 0 &&
            <>
              <Pagination className="mb-3" count={totalpage} page={currentPage} variant="outlined" shape="rounded"
                onChange={onChangePage} />
              {resultlist}
            </>
          }

        </div>
      </div>

    </div>

  )
}