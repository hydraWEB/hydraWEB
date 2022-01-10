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
import { AllTags, TagAndGIS } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";
import Checkbox from '@material-ui/core/Checkbox';
import SearchFunction from './SearchFunction2.jsx'

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

const InputWrapper = styled.div(
  props => (
    {
      width: "100%",
      borderWidth: "2x",
      borderColor: "white",
      borderBottom: "1px",
      borderBottomStyle: "solid",
      borderRadius: "0px",
      display: 'flex',
      backgroundColor: props.backgroundColor ? "#6465688e" : "#6465688e",
      alignItems: 'flex-start',
      flexFlow: '1',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: "0px",
      paddingRight: "5px",

    }
  )
)


const StyledLabel = styled.label(
  props => (
    {
      padding: "8px 10px 0px 10px",
      marginBottom: 0
    }
  )
)


export default function CircleAnalysis({ radius, setRadius, setAllData, allData, layers, setLayers, 
  mode, setMode, lastClick, zoomTo, setHoverInfo, setClickInfo, setShowMoreData, setAllCAData}) {

  const { t, i18n } = useTranslation()
  const { addToast } = useToasts();
  const [searchResult, setsearchResult] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageData, setCurrentPageData] = useState([])
  const [totalpage, setTotalPage] = useState(0)
  const [data, setData] = useState()
  const [GISAndTag, setGISAndTag] = useState([])
  const [tagFilterGIS, setTagFilterGIS] = useState()    //記錄所有要被刪除的圖層資料
  const [sortedResultData, setSortedResultData] = useState()
  const [allGIS, setAllGIS] = useState([])


  const [isLoading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState([])
  const [allTagsState, setAllTagsState] = useState([])
  function setEditLayerMode() {
    if (mode == DrawCircleFromCenterMode) {
      setMode(ViewMode,"circle-analysis-layer")
    } else {
      setMode(DrawCircleFromCenterMode,"circle-analysis-layer")
    }
  }

  useEffect(() => {
    AllTags().then((res) => {
      addToast(t('tags_loading_success'), { appearance: 'success', autoDismiss: true });
      console.log(res.data.data);
      let arr1 = [];
      res.data.data.forEach(element => {
        arr1.push([element,true]);
      });
      setAllTags(arr1);
      console.log(arr1)
    }).catch((err) => {
      addToast(t('tags_loading_fail'), { appearance: 'error', autoDismiss: true });
      console.log(err)
    }).finally(() => {
    })

    TagAndGIS().then((res) => {
      addToast(t('tags_loading_success'), { appearance: 'success', autoDismiss: true });
      let arr = [];
      setGISAndTag(res.data.data);
      res.data.data.forEach(e => {
        arr.push(e[0])
      });
      setAllGIS(arr);
    }).catch((err) => {
      addToast(t('tags_loading_fail'), { appearance: 'error', autoDismiss: true });
      console.log(err)
    }).finally(() => {
    })

  }, [])


  function sortSearchResult(data){
    if(data.length !== 0){
      let searchName = data[0][0]
      let sortedResultDict = {}
      let sortedRowResult = []
      let finalSortedResult = []
      for (let i = 0;i<data.length;i++){
        if (searchName === data[i][0]){
          sortedRowResult.push(data[i][1])
        }
        else{
          sortedResultDict = {
            "resultName": searchName,
            "data": sortedRowResult
          }
          finalSortedResult.push(sortedResultDict)
          searchName = data[i][0]
          sortedRowResult = []
          sortedRowResult.push(data[i][1])
        }
      }
      return finalSortedResult
    }
    else{
      let tempArr = []
      return tempArr
    }
    
  }

  function onChangeCheckItems(e){
    let tagsToRemove = []
    let originArr = [...allTags];
    for (let i = 0;i<originArr.length;i++){
      
      if(originArr[i][0] === e.target.value){
        if(originArr[i][1]) originArr[i][1] = false
        else originArr[i][1] = true
      }
      if(!originArr[i][1]) tagsToRemove.push(originArr[i][0])
    }

    allData.forEach((element)=>{
      
    })
    
    let filteredAllGIS = []
    
    for (let i =0;i<tagsToRemove.length;i++){
      for (let j =0;j<GISAndTag.length;j++){
        for (let tag=0;tag<GISAndTag[j][1].length;tag++){
          if(GISAndTag[j][1][tag] === tagsToRemove[i]){
            filteredAllGIS.push(GISAndTag[j][0])
            /* const index = filteredAllGIS.indexOf(GISAndTag[j][0])
            if(index > -1){
              filteredAllGIS.splice(index, 1);
            } */
            break
          }
        }
      }
    }
    setTagFilterGIS(filteredAllGIS)
    setAllTags(originArr)
  }

  function CheckItem({data}){
    return (
      <InputWrapper>
        <Checkbox
          checked={data[1]}    
          value = {data[0]}
          onChange={onChangeCheckItems}
          color="default"
        />
        <StyledLabel>
          <div>
            {data[0]}
          </div>
        </StyledLabel>
      </InputWrapper>
    )
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
          const index = tagFilterGIS.indexOf(feat.name)
          if(index === -1){
            for (let f = 0; f < feat.data.features.length; f++) {
              let x = feat.data.features[f].geometry.coordinates[0]
              let y = feat.data.features[f].geometry.coordinates[1]
              let rad = distance(lastClick[0], lastClick[1], x, y)
              if (rad <= radius) {
                let resultArray = []
                resultArray.push(feat.name)
                resultArray.push(feat.data.features[f])
                resultMeasurement.push(resultArray)
                data.push(feat)
              }
            }
          }
        }
      }
      let sortedResult = sortSearchResult(resultMeasurement)



      
      setsearchResult(sortedResult)
      currentPageDataSetting(sortedResult, 1)
      setAllCAData(sortedResult)
      setCurrentPage(1)
      setData(data)
    }
  }

  let taglist = allTags.map((d) => 
    <div>
      <CheckItem data ={d} key={d[0]}/>
    </div>
  );

  let resultlist = currentPageData.map((d) =>
    <div>
      {
        d !== undefined &&
        <SearchFunction data={d} zoomTo={zoomTo} allData={allData} setAllData={setAllData} layers={layers}
          setLayers={setLayers} setHoverInfo={setHoverInfo} setClickInfo={setClickInfo} zoomInData={data} 
          setShowMoreData={setShowMoreData} allCAData={searchResult}/>
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
          <div className={styles.circle_analysis_tag_top}>
            <p>{t('all_tags')}</p>
            {taglist}
          </div>
          <div className={styles.circleAnalysis_top}>
            <p>{t('radius')}:{radius}km</p>
            {lastClick.length > 1 &&
              <p>{t('center_point')}:{lastClick[0]}, {lastClick[1]}</p>

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