
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
import Select from '@mui/material/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputBase from "@material-ui/core/InputBase";
import Pagination from "@material-ui/lab/Pagination";
import SearchFunction from './SearchFunction.jsx'
import MenuItem from '@mui/material/MenuItem';

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


const useStyles1 = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: 0,
    '& label.Mui-focused': {
      color: "white",
    },
    '&:focused': {
      color: "white",
      backgroundColor: '#fafafa',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    '& fieldset': {
      borderColor: 'red',
    },
    '&:hover fieldset': {
      borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#001845',
    transition: theme.transitions.create(['border-color', 'box-shadow']),

  },
  focused: {},
}));


const StyledLabel = styled.label(
  props => (
    {
      padding: "8px 10px 0px 10px",
      marginBottom: 0
    }
  )
)


function SearchTextField(props) {
  const classes1 = useStyles1();
  const classes2 = useStyles2();

  return <TextField className={classes1.root} InputProps={{ classes2, disableUnderline: true }} {...props} />;
}




export default function Search({ allData, setAllData, layers, setLayers, zoomTo, setHoverInfo, setClickInfo }) {
  const { t, i18n } = useTranslation();
  const [cursor, setCursor] = useState("crosshair");
  const [text, setText] = useState("")
  const [filteredMeasurement, setFilteredMeasurement] = useState()
  const [searchResult, setsearchResult] = useState([])
  const [data, setData] = useState()
  const [tag, setTag] = useState([])
  const [currentTag, setcurrentTag] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageData, setCurrentPageData] = useState([])
  const [totalpage, setTotalPage] = useState(0)
  
  /* const changeCursor = () => {
    setCursor('crosshair')
  }
   */

  const sendText = (t) => {
    setText(t.target.value)
  }

  function filter() {
    let alldt = allData
    let resultMeasurement = []
    let data = []
    for (let i = 0; i < alldt.length; i++) {
      let file = alldt[i].files
      for (let dt = 0; dt < file.length; dt++) {
        let feat = file[dt]
        for (let f = 0; f < feat.data.features.length; f++) {
          for(let t in feat.data.features[f].properties){
            if (t.indexOf('prop') >= 0){
              for(let k in feat.data.features[f].properties[t]){
                if(k === currentTag){
                  if(typeof feat.data.features[f].properties[t][currentTag] == "string"){
                    if (feat.data.features[f].properties[t][currentTag].indexOf(text) >= 0){
                      resultMeasurement.push(feat.data.features[f])
                      data.push(file[dt])
                    }
                  }
                  else if(typeof feat.data.features[f].properties[t][currentTag] == "number"){
                    if (feat.data.features[f].properties[t][currentTag] === parseFloat(text)){
                      resultMeasurement.push(feat.data.features[f])
                      data.push(file[dt])
                    }
                  }
                  else if(typeof feat.data.features[f].properties[t][currentTag] == "boolean"){
                    if (feat.data.features[f].properties[t][currentTag].toString() === text){
                      resultMeasurement.push(feat.data.features[f])
                      data.push(file[dt])
                    }
                  }
                }
              }
            }
            else if (t == currentTag) {
              if(typeof feat.data.features[f].properties[currentTag] == "string"){
                if (feat.data.features[f].properties[currentTag].indexOf(text) >= 0){
                  resultMeasurement.push(feat.data.features[f])
                  data.push(file[dt])
                }
              }
              else if(typeof feat.data.features[f].properties[currentTag] == "number"){
                if (feat.data.features[f].properties[currentTag] === parseFloat(text)){
                  resultMeasurement.push(feat.data.features[f])
                  data.push(file[dt])
                }
              }
              else if(typeof feat.data.features[f].properties[currentTag] == "boolean"){
                if (feat.data.features[f].properties[currentTag].toString() === text){
                  resultMeasurement.push(feat.data.features[f])
                  data.push(file[dt])
                }
              }
            }
          }
        }
      }
    }
    setData(data)
    setsearchResult(resultMeasurement)
    setCurrentPage(1)
    currentPageDataSetting(resultMeasurement, 1)
  }

  let selectTag = tag.map((d)=>
  <option value={d}>{d}</option>
  );




  const resultlist = currentPageData.map((d) =>
  <div>
      {
        d !== undefined && 
        <SearchFunction data = {d} zoomTo={zoomTo} allData={allData} setAllData={setAllData} layers={layers} 
        setLayers={setLayers} setHoverInfo={setHoverInfo} setClickInfo={setClickInfo} zoomInData={data}/>
      }
    </div>
  );

  const handleChange = (e) =>{
    setcurrentTag(e.target.value)
  }

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
    let alltags = []
    let allMeasurement = []
    let filteredMeasurement = []
    if (allData.length > 0) {
      let alldt = [...allData]
      for (let i = 0; i < alldt.length; i++) {
        let file = alldt[i].files
        for (let dt = 0; dt < file.length; dt++) {
          let feat = file[dt]
          for (let f = 0; f < feat.data.features.length; f++) {
            allMeasurement.push(feat.data.features[f].properties.measurement)
            for (let key in feat.data.features[f].properties){
              if(key.indexOf("prop") >= 0){
                for(let prop in feat.data.features[f].properties[key]){
                  alltags.push(prop)
                }
              }
              else{
                alltags.push(key)
              }
              /* 
              alltags.push(key) */
            }

          }
        }
      }
      filteredMeasurement = [...new Set(allMeasurement)]  //unique
    }
    let filteredtags = [...new Set(alltags)]
    setTag(filteredtags)
    setFilteredMeasurement(filteredMeasurement)
    

  }, [allData])


  return (
    <div >
      <h4 className={styles.func_title}>{t('search')}</h4>
      <div className={styles.function_wrapper}>
      <div className={styles.search_tag}>
      <p  className={styles.search_tag_text}>{t('tags')}：</p>
        <FormControl >
          <NativeSelect

            value={currentTag}
            onChange={handleChange}
          >
            {selectTag}
          </NativeSelect>
        </FormControl>
      </div>
      <div className={styles.search_bar}>
        <SearchTextField
          label={t('search_by_tag')}
          defaultValue=""
          variant="filled"
          id="Search"
          onChange={sendText}
        />
        <div className={styles.search_btn}>
          <IconButton type="submit" aria-label="search" onClick={filter}>
            <SearchIcon />
          </IconButton>
        </div>
        {/* <div>
          <Button variant="contained" onClick = {changeCursor}>Change Cursor</Button>
        </div> */}
      </div>
      </div>
     


      <div>
        {resultlist.length > 0 &&
          <>
            <Pagination className="mb-3" count={totalpage} page={currentPage} variant="outlined" shape="rounded"
              onChange={onChangePage} />
            
            {resultlist}
          </>
        }
      </div>
    </div>
  )
}