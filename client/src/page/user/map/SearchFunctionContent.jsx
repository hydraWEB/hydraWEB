import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import { green } from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import { GeoJsonLayer } from '@deck.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { zoomIn } from './LayerV2'
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import Pagination from "@material-ui/lab/Pagination";


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
      minHeight: 15,
      '&$expanded': {
        minHeight: 15,
      },
      
    },
    content: {
      width:"100%",
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);

  const AccordionSummary2 = withStyles({
    root: {
      backgroundColor: '#003e45',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 15,
      width:430,
      '&$expanded': {
        minHeight: 15,
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
  

//searchFunction.jsx所用到的函式
export default function SearchFunctionContent({data,zoomTo, allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, zoomInData}){
  
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageData, setCurrentPageData] = useState([])
  const [totalpage, setTotalPage] = useState(0)

  //將結果分割成10筆一頁
  function currentPageDataSetting(resultMeasurement, page) {
    let totalPage = Math.ceil(resultMeasurement.length / 10)
    let pageData = resultMeasurement.slice((page - 1) * 10, page * 10 - 1)
    setCurrentPageData(pageData)
    setTotalPage(totalPage)
  }
  //當頁面變化時執行的函式
  const onChangePage = (e, page) => {
    currentPageDataSetting(data, page)
    setCurrentPage(page)
  }
  //當data變化時執行的函式
  useEffect(() => {
    currentPageDataSetting(data,1)
    setCurrentPage(1)
  },[data])


  //顯示詳細資料的函式
  function InnerResult(data){
      var title = []
      function btnClicked() {
        zoomIn(allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, data.data.geometry, zoomInData)
        zoomTo(data.data.geometry)
      }
      const xyCord = Object.entries(data.data.geometry).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const list2 = Object.entries(value).map(([key2, value2]) => {
            let tempKey = 'X Coordinate'
            if (key2 === '1') {
              tempKey = 'Y Coordinate'
            }
            return (
              <div>{tempKey} : {value2.toString()}</div>
            )
          })
          if (key === "coordinates") {
            return (
              <div>
                <div>{list2}</div>
              </div>
            )
          }
          else{
            return (
              <div>
                <h5>{key}:</h5>
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
      const list = Object.entries(data.data.properties).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            const list2 = Object.entries(value).map(([key2, value2]) => {
            return (
                <div>{key2} : {value2.toString()}</div>
            )
            })
            return (
            <div>
                <h5>{key}:</h5>
                <div>{list2}</div>
            </div>
            )
        } else {
            return (
            <div>{key} : {value.toString()}</div>
            );
        }
      })
      for (var i in data.data.properties) {
        if (i.indexOf("prop") >= 0) {
            if (title.length === 0) {
            title.push(data.data.properties["prop1"]["檔名"])
            break
            }
        }
        else {
            if (i === "measurement") {
            title.push(data.data.properties[i])
            break
            }
        }
      }
      return (
        <div>
            <Accordion>
            <AccordionSummary2 aria-controls="panel1d-content1" id="panel1d-header1" expandIcon={<ExpandMoreIcon />}>
                  <div className={styles.search_div}>
                    <Button variant="contained"  onClick={btnClicked}>
                      查看
                    </Button>
                    <Typography className="ml-3" >{title}</Typography>
                  </div>
                </AccordionSummary2>
            <AccordionDetails>
                <div className={styles.circle_analysis_result_container}>
                    <div className={styles.circle_analysis_result_wrapper3}>
                    <> {xyCord}</>
                    </div>
                    <div className={styles.circle_analysis_result_wrapper3}>
                    <> {list}</>
                    </div>
                </div>
            </AccordionDetails>
            </Accordion>
        </div>
        )
  }
    const resultlist = Object.entries(currentPageData).map(([key, value]) => {
      return (
        <div >
          <InnerResult data = {value}/>
        </div>
      )
    })
    return (
      <div className={styles.menu_desk_outer_second_layer}>
        {data.length > 0 &&
            <>
              {resultlist}
              <Pagination className="mt-2" count={totalpage} page={currentPage} variant="outlined" shape="rounded"
                onChange={onChangePage} />
              
            </>
          }
      </div>
    )
  }