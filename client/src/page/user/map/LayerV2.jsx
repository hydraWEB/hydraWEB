import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DataFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { ColumnLayer } from '@deck.gl/layers';
import { HexagonLayer, HeatmapLayer } from '@deck.gl/aggregation-layers';
import { LayerList, UploadFile, DownloadMapData, ChoushuiLayerList, GNSSList, PartLayerList } from '../../../lib/api'
import React, { useEffect, useState, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { useTranslation, Trans } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import toast, { Toaster } from 'react-hot-toast';
import TooltipMaterial from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import axios from "axios";

const Accordion = withStyles({
  root: {
    backgroundColor: '#457ee7aa',
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
    backgroundColor: '#457ee7aa',
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

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <TooltipMaterial open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </TooltipMaterial>
  );
}

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
//將字串轉化成hash
const hashCode = (str) => { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
//將字串轉成rgb
export const getDotColor = d => {
  let a = hashCode(d.name)

  return [(a >> 1) & 255, (a << 3) & 255, (a >> 5) & 255]
};

export const getDotColor2 = d => {
  if (d) {
    return
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
//將rgb轉成hex
function rgbToHex(value) {
  return "#" + componentToHex(value[0]) + componentToHex(value[1]) + componentToHex(value[2]);
}

const checkBoxStyle = makeStyles({
  root: (props) => ({
    color: props.color,
    "&checked": {
      color: props.color
    }
  })
});
//checkbox的設定
function CustomCheckBox({ color, checked, onChange }) {
  const classes1 = checkBoxStyle({ color: color });
  return (
    <Checkbox
      className={classes1.root}
      checked={checked}
      onChange={onChange}
      color="default"
    />
  )
}
//檢查資料是否有變化
function CheckItem({ data, currentLayer, setCurrentLayer, onChange, originData }) {
  const { t, i18n } = useTranslation();
  const [timeList, setTimeList] = useState([])
  const [min, setmin] = useState(0)
  const [max, setmax] = useState(0)
  const [currentSliderValue, setCurrentSliderValue] = useState(0)
  const [isLoadingData, setLoadingData] = useState(false);
  //尋找最大和最小時間
  function findminmax(arr) {
    setmin(arr[0].value)
    setmax(arr[arr.length - 1].value)
  }
  //每當data有變化，執行裡面的程式
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
  //修改時間的格式成YYYY/MM/DD
  function valueLabelFormat(value) {
    let dayjs = require("dayjs")
    return dayjs(value).format('YYYY/MM/DD')
  }

  //當滑條改變時觸發
  const handleChange = (event, newValue) => {
    setCurrentSliderValue(newValue)
    setCurrentLayer(newValue)
  };
  //下載檔案
  function downloadFile(data){
    //較大的檔案時後端處理後回傳資料並下載
    if(data.name !== "ps" && data.name !== "time_series_108彰化地區地層下陷水準檢測成果表" 
    && data.name !== "彰化水準測量檢測成果表" && data.name !== "time_series_108雲林地區地層下陷水準檢測成果表"
    && data.name !== "雲林水準測量檢測成果表"){
      // Create a blob with the data we want to download as a file
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
      // Create an anchor element and dispatch a click event on it
      // to trigger a download
      const a = document.createElement('a')
      a.download = data.name
      a.href = window.URL.createObjectURL(blob)
      const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      a.dispatchEvent(clickEvt)
      a.remove()
    }
    //其他較小的資料直接在前端處理並下載
    else{
      setLoadingData(true)
      DownloadMapData({
        data: data.name,
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data.name+'.json'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }).finally(() => {
        setLoadingData(false)
      })
    }
  }
  //點擊下載按鈕時觸發
  const downloadOnClick = (data) => {
    //const toastid = toast.loading(t('downloading'))
    downloadFile(data)
    //toast.success(t('download_complete'), {id:toastid})
  }

  return (
    <InputWrapper backgroundColor={rgbToHex(getDotColor(data))}>
      <CustomCheckBox
        color={rgbToHex(getDotColor(data))}
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
            color="secondary"
            step={null}
            defaultValue={min}
            marks={timeList}
            onChange={handleChange}
            valueLabelFormat={valueLabelFormat}
            ValueLabelComponent={ValueLabelComponent}
          />
        </>
        }
        <div className={styles.info_btn}>
        </div>
      </StyledLabel>
      <div className={styles.progress_button}>
        <Button className={styles.download_button} onClick={() => downloadOnClick(data)}>{t('download')}</Button>
      </div>
      {isLoadingData &&
        <div>
          <img
            className={styles.loading_image_3}
            src="/img/loading.svg"
          />
        </div>
      }
    </InputWrapper>
  )
}
//搜尋後點擊查看的函式
export function zoomIn(allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, geometry, data) {
  //點擊地圖的點時觸發
  const onClick = (data) => {
    console.log(data)
    setClickInfo(data)
  }
  //指著地圖的點時觸發
  const onHover = (data) => {
    setHoverInfo(data)
  }
  let newMapData = [...allData]
  for (let i = 0; i < newMapData.length; i++) {
    for (let j = 0; j < newMapData[i].files.length; j++) {
      for (let k = 0; k < data.length; k++) {
        if (newMapData[i].files[j].name === data[k].name) {
          newMapData[i].files[j].value = true
        }
      }
    }

  }
  setAllData(newMapData)
  let newLayer = []
  if (layers.length > 0) {
    newLayer = [...layers]
    layers.forEach((element, i) => {
      for (let k = 0; k < data.length; k++) {
        if (element.props.id === data[k].name) {
          newLayer[i] = new GeoJsonLayer({
            id: data[k].name,
            name: data[k].name,
            data: data[k].data,
            //data_type: newMapData[i].name,
            visible: true,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data[k]),
	          lineWidthMinPixels: 3,
            getLineColor: getDotColor(data[k]),
            stroked: false,
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            updateTriggers: {
              visible: data.value
            }
          })
        }
      }

    })
  }
  setLayers(newLayer)
}
//設定圖層套疊的函式
export default function Layer({ allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, setChartIsVisible, setChartMin, setChartMax, swapData, setSwapData }) {

  const { t, i18n } = useTranslation();
  const [originData, setOriginData] = useState([]) //原本的不會修改到的data
  const [dataLoadState, setDataLoadState] = useState(0)
  const [dataLoadStateProgess, setDataLoadProgess] = useState(0)
  const [mode, setMode] = useState(0)
  const [gnssList, setGnssList] = useState([])
  const [isPartData, setIsPartData] = useState(false)
  const [databaseName, setDatabaseName] = useState([])
  const [timeSeriesMinMax, setTimeSeriesMinMax] = useState([])
  const { addToast } = useToasts();

  //指著地圖的點時觸發
  const onHover = (data) => {
    setHoverInfo(data)
  }
  //點擊地圖的點時觸發
  const onClick = (data) => {
    console.log(data)
    setClickInfo(data)
  }
  //取得時序資料的時間
  const getFilterValue = (d) => {
    const dayjs = require("dayjs")
    let time1 = dayjs(d.properties.time)
    return time1.valueOf()
  }
  //取得一筆時序資料的最大最小時間
  function findTimeSeriesMinMaxIndex(name, timeSeriesMinMax) {
    for (let i = 0; i< timeSeriesMinMax.length;i++){
      if(timeSeriesMinMax[i].name === name){
        return i
      }
    }
    return -1
  }
  //取得所有時序資料的最大最小時間
  function findMinMax(allData) {
    let min = 999999
    let max = -99999
    for (let i = 0; i < allData.length; i++){
      if(parseFloat(allData[i].properties['h(m)']) > max){
        max = parseFloat(allData[i].properties['h(m)'])
      }
      if(parseFloat(allData[i].properties['h(m)']) < min){
        min = parseFloat(allData[i].properties['h(m)'])
      }
    }
    return [max, min]
  }
  //顯示ps的彩虹的地圖顏色
  function fillcolor2(d) {
    function hslToRgb(h, s, l) {
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let hp = h / 60.0;
      let x = c * (1 - Math.abs((hp % 2) - 1));
      let rgb1;
      if (isNaN(h)) rgb1 = [0, 0, 0];
      else if (hp <= 1) rgb1 = [c, x, 0];
      else if (hp <= 2) rgb1 = [x, c, 0];
      else if (hp <= 3) rgb1 = [0, c, x];
      else if (hp <= 4) rgb1 = [0, x, c];
      else if (hp <= 5) rgb1 = [x, 0, c];
      else if (hp <= 6) rgb1 = [c, 0, x];
      let m = l - c * 0.5;
      return [
        Math.round(255 * (rgb1[0] + m)),
        Math.round(255 * (rgb1[1] + m)),
        Math.round(255 * (rgb1[2] + m))];
    }
    /* console.log(hslToRgb(8,1,0.5)) */
    const maxValue = 47.3;
    const minValue = -45.3;
    const count = 240 / (maxValue - minValue);    //0.38583333    2.591792657
    let calc = Math.ceil((d.properties + 45.3) * count)

    return hslToRgb(calc, 0.9, 0.5)
  }
  //顯示GNSS的彩虹的地圖顏色
  function fillcolorGNSS(d, idx, timeSeriesMinMax) {
    
    function hslToRgb(h, s, l) {
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let hp = h / 60.0;
      let x = c * (1 - Math.abs((hp % 2) - 1));
      let rgb1;
      if (isNaN(h)) rgb1 = [0, 0, 0];
      else if (hp <= 1) rgb1 = [c, x, 0];
      else if (hp <= 2) rgb1 = [x, c, 0];
      else if (hp <= 3) rgb1 = [0, c, x];
      else if (hp <= 4) rgb1 = [0, x, c];
      else if (hp <= 5) rgb1 = [x, 0, c];
      else if (hp <= 6) rgb1 = [c, 0, x];
      let m = l - c * 0.5;
      return [
        Math.round(255 * (rgb1[0] + m)),
        Math.round(255 * (rgb1[1] + m)),
        Math.round(255 * (rgb1[2] + m))];
    }
    /* console.log(hslToRgb(8,1,0.5)) */
    const maxValue = timeSeriesMinMax[idx].minmax[0];
    const minValue = timeSeriesMinMax[idx].minmax[1];
    const count = 240 / (maxValue - minValue);    //240(hue)是彩虹顏色的最大值
    let calc = Math.ceil((parseFloat(d.properties['h(m)']) + Math.abs(minValue)) * count)

    return hslToRgb(calc, 0.9, 0.5)
  }
  //檢查名字是否為GNSS
  function checkIsGNSS(name) {
    let isFound = false
    if(name.includes("PPP2")) {
      return true
    }
    else{
      for (let i = 0; i<gnssList.length;i++){
        if(gnssList[i] === name){
          isFound = true
          break;
        }
      }
      return isFound
    }
  }
  //取得與相同的資料
  function getLayer(data) {
    layers.forEach(element => {
      if (element.props.name === data.name) {
        return element
      }
    })
  }
  //將後端回傳的geojson格式轉換成deck.gl的格式
  function setIntialLayer(list, timeSeriesMinMax){
    let newLayer = [...layers]
    list.forEach((l, index) => {
      l.files.forEach((data, idx) => {
        if (data.name === "GPS") {
          let hexdata = []
          data.data.features.forEach((dl) => {
            try {
              hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
            } catch (error) {

            }
          })
          newLayer.push(new ScenegraphLayer({
            id: data.name,
            name: data.name,
            data: hexdata,
            pickable: true,
            visible: false,
            data_type: l.name,
            scenegraph: 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
            getPosition: d => d.COORDINATES,
            getOrientation: d => [0, Math.random() * 180, 90],
            _animations: {
              '*': { speed: 5 }
            },
            sizeScale: 500,
            _lighting: 'pbr'
          }))
          return
        }
        else if (data.name === "ps") {
          let hexdata = []
          data.data.features.forEach((dl) => {
            try {
              hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
            } catch (error) {

            }
          })
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
              getFillColor: fillcolor2,
              stroked: false,
              // Interactive props
              pickable: true,
              autoHighlight: true,
              onHover: onHover,
              onClick: onClick,
              updateTriggers: {
                visible: data.value
              }
            })
          )
          return
        }
        else if (checkIsGNSS(data.name) && data.time_serie) {
          let idx = findTimeSeriesMinMaxIndex(data.name, timeSeriesMinMax)
          newLayer.push(
            new GeoJsonLayer({
              id: data.name,
              name: data.name,
              data: data.data,
              visible: data.value,
              pointType: 'circle+text',
              // Styles
              filled: true,
              getText: f => f.properties['STATION'],
              getTextAlignmentBaseline: 'bottom',
              getTextAnchor: 'start',
              getTextSize: 12,
              pointRadiusMinPixels: 2,
              pointRadiusScale: 5,
              getPointRadius: f => 5,
              getFillColor: d => fillcolorGNSS(d, idx, timeSeriesMinMax),
              textCharacterSet: "auto",
              // Interactive props
              pickable: true,
              autoHighlight: true,
              onHover: onHover,
              filterEnabled: false,
              getFilterValue: getFilterValue,
              filterTransformSize: true,
              filterTransformColor: true,
              filterRange: [0, 0],
              // Define extensions
              extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
              onClick: onClick,
              updateTriggers: {
                getFilterValue: getFilterValue,
                visible: data.value,
              }
            })
          )
        }
        else if(checkIsGNSS(data.name)){
          let idx = findTimeSeriesMinMaxIndex(data.name, timeSeriesMinMax)
          newLayer.push(
            new GeoJsonLayer({
              id: data.name,
              name: data.name,
              data: data.data,
              visible: data.value,
              pointType: 'circle+text',
              // Styles
              filled: true,
              getText: f => f.properties['STATION'],
              getTextAlignmentBaseline: 'bottom',
              getTextAnchor: 'start',
              getTextSize: 12,
              pointRadiusMinPixels: 2,
              pointRadiusScale: 5,
              getPointRadius: f => 5,
              getFillColor: d => fillcolorGNSS(d, idx, timeSeriesMinMax),
              stroked: false,
              textCharacterSet: "auto",
              // Interactive props
              pickable: true,
              autoHighlight: true,
              onHover: onHover,
              onClick: onClick,
              updateTriggers: {
                visible: data.value
              }
            })
          )
          return
        }
        else if(data.name.includes("地下水觀測井位置圖")){
          newLayer.push(
            new GeoJsonLayer({
              id: data.name,
              name: data.name,
              data: data.data,
              visible: data.value,
              pointType: 'circle+text',
              // Styles
              filled: true,
              getText: f => f.properties['NAME_C'],
              getTextAlignmentBaseline: 'bottom',
              getTextAnchor: 'start',
              getTextSize: 12,
              pointRadiusMinPixels: 2,
              pointRadiusScale: 5,
              getPointRadius: f => 5,
              getFillColor: getDotColor(data),
              stroked: false,
              textCharacterSet: "auto",
              // Interactive props
              pickable: true,
              autoHighlight: true,
              onHover: onHover,
              onClick: onClick,
              updateTriggers: {
                visible: data.value
              }
            })
          )
          return
        }
        
        else if (data.time_serie) {
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
              filterEnabled: false,
              getFilterValue: getFilterValue,
              filterTransformSize: true,
              filterTransformColor: true,
              filterRange: [0, 0],
              // Define extensions
              extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
              onClick: onClick,
              updateTriggers: {
                getFilterValue: getFilterValue,
                visible: data.value,
              }
            })
          )
        } else {
          console.log(data)
          newLayer.push(
            new GeoJsonLayer({
              id: data.name,
              name: data.name,
              data: data.data,
              visible: data.value,
              data_type: l.name,
              // Styles
              filled: true,
              pointRadiusMinPixels: 2,
              pointRadiusScale: 5,
              getPointRadius: f => 5,
              lineWidthMinPixels: 3,
              getFillColor: getDotColor(data),
              getLineColor: getDotColor(data),
              // Interactive props
              pickable: true,
              autoHighlight: true,
              onHover: onHover,
              onClick: onClick,
              updateTriggers: {
                visible: data.value,
              }
            }))
        }
      })
    })
    return newLayer
  }
  //當點擊checkbox時呼叫的函式將被點擊的圖層顯示在地圖上
  function setCurrentLayer(data, index1, time, index) {
    let newLayer = [...layers] //複製一個layer
    let newMapData = [...allData]
    newMapData[index1].files[index].value = true
    newMapData[index1].files[index].current_time = time
    setAllData(newMapData)

    function onFilteredItemsChange(id, count) {
      console.log(count)
    }

    newLayer.forEach((element, i) => {
      if (element.props.name === data.name) {
        if(checkIsGNSS(data.name) && data.time_serie){
          let idx = findTimeSeriesMinMaxIndex(data.name, timeSeriesMinMax)
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            data_type: newMapData[index1].name,
            pointType: "circle+text",
            visible: data.value,
            // Styles
            filled: true,
            getText: f => f.properties['STATION'],
            getTextAlignmentBaseline: 'bottom',
            getTextAnchor: 'start',
            getTextSize: 12,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: d => fillcolorGNSS(d, idx, timeSeriesMinMax),
            textCharacterSet: "auto",
            stroked: false,
            lineWidthMinPixels: 3,
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            filterEnabled: true,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,
            filterRange: [time, time],
            onFilteredItemsChange: onFilteredItemsChange,
            // Define extensions
            extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
            updateTriggers: {
              filterRange: [time, time],
              onFilteredItemsChange: onFilteredItemsChange,
              getFilterValue: getFilterValue,
              visible: data.value,
            }
          })
        }
        else{
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            data_type: newMapData[index1].name,
            visible: data.value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            stroked: false,
            lineWidthMinPixels: 3,
            getLineColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            filterEnabled: true,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,
            filterRange: [time, time],
            onFilteredItemsChange: onFilteredItemsChange,
            // Define extensions
            extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
            updateTriggers: {
              filterRange: [time, time],
              onFilteredItemsChange: onFilteredItemsChange,
              getFilterValue: getFilterValue,
              visible: data.value,
            }
          })
        }
        
      }
    })
    setLayers(newLayer)
  }
  //點擊部分資料呼叫的函式，取得部分資料庫的名稱
  function setChoushuiEditLayer(){
    ChoushuiLayerList().then((res) => {
      setDataLoadState(1)
      let resultArr = []
      res.data.data.forEach((element, idx) => {
        resultArr.push([element, false])
      })
      setDatabaseName(resultArr)
    }).catch((err) => {
      setDataLoadState(2)
    }).finally(() => {})
    setIsPartData(true)
    setMode(1)
    setDataLoadState(0)
    let temp = [...swapData]
    setSwapData(allData)
    setAllData(temp)
  }
  //點擊所有資料呼叫的函式，取得非部分資料庫的名稱
  function setFullLayer(){
    LayerList().then((res) => {
      let resultArr = []
      res.data.data.forEach((element, idx) => {
        resultArr.push([element, false])
      })
      setDatabaseName(resultArr)
      setDataLoadState(1)
    }).catch((err) => {
    }).finally(() => {})
    setMode(0)
    setIsPartData(false)
    let temp = [...swapData]
    setSwapData(allData)
    setAllData(temp)
  }
  //點擊送出按鈕呼叫的函式
  function LayerNameOnClick(){
    let names = []
    let allDataArr = []
    for (let idx = 0; idx < allData.length; idx++){
      if(isPartData){
        allDataArr.push(allData[idx]["name"]+"_part")
      }
      else{
        allDataArr.push(allData[idx]["name"])
      }
    }
    for (let i = 0; i < databaseName.length; i++){
      if(databaseName[i][1]){
        let dataname = databaseName[i][0]
        if(isPartData){
          dataname = dataname + "_part"
        }
        names.push(dataname)
      }
    }
    names = names.filter(val => !allDataArr.includes(val))
    let timeseriesMinMax = [...timeSeriesMinMax]
    let newlist = []
    PartLayerList({
      database : names
    }).then((res) => {
      res.data.data.forEach((element, idx) => {
        let files = element.file
        files.forEach((element2, idx) => {
          files[idx].value = false //不會先顯示圖層
          files[idx].current_time = 0 //不會先顯示圖層
          if(files[idx].time_serie || checkIsGNSS(files[idx].name)){
            let dict = {
              name : files[idx].name,
              minmax : findMinMax(files[idx].data.features)
            }
            timeseriesMinMax.push(dict)
          }
        })
        newlist.push({
          "id": idx,
          "name": element.name,
          "files": files,
        })
      })
      
      let combineArr = [...allData, ...newlist]
      setAllData(combineArr)
      setLayers(setIntialLayer(newlist, timeseriesMinMax))
      setTimeSeriesMinMax(timeseriesMinMax)
    })
  }
  //資料庫名稱變化時呼叫的函式
  function onChangeCheckItems(e){
    let newArr = [...databaseName]
    for (let i = 0;i<newArr.length;i++){
      if(newArr[i][0] === e.target.value){
        if(newArr[i][1]) newArr[i][1] = false
        else newArr[i][1] = true
      }
    }
    setDatabaseName(newArr)
  }

  // index1:分類的index index:分類中檔案的index
  const OnListItemsChange = (e, index1, data, index) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newMapData = [...allData]
    newMapData[index1].files[index].value = value
    setAllData(newMapData)
    let newLayer = [...layers] //複製一個layer
    newLayer.forEach((element, i) => {
      // 3D資料
      if (element.props.name === data.name && data.name === "GPS") {
        let threeDimensionData = [];
        data.data.features.forEach((dl) => {
          threeDimensionData.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties });
        })
        newLayer[i] = new ScenegraphLayer({
          id: data.name,
          name: data.name,
          data: threeDimensionData,

          pickable: true,
          visible: data.value,
          scenegraph: 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
          getPosition: d => d.COORDINATES,
          getOrientation: d => [0, Math.random() * 180, 90],
          _animations: {
            '*': { speed: 5 }
          },
          sizeScale: 500,
          _lighting: 'pbr'
        });
        return;
      }

      // ps資料
      else if (element.props.name === "ps" && data.name === "ps") { //3d圖層
        setChartIsVisible(value)  //地圖右邊的顏色條
        setChartMin(-45.3)
        setChartMax(47.3)
        let psData = []
        data.data.features.forEach((dl) => {
          try {
            psData.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
          } catch (error) {

          }
        })
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          data_type: newMapData[index1].name,
          visible: value,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: fillcolor2,
          stroked: false,
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          onClick: onClick,
          updateTriggers: {
            visible: data.value
          }
        })
        return;
      }
      else if (element.props.name === data.name && checkIsGNSS(data.name) && data.time_serie){
        let idx = findTimeSeriesMinMaxIndex(data.name, timeSeriesMinMax)
        let minmax = []
        minmax = findMinMax(data.data.features)
        setChartIsVisible(value)  //地圖右邊的顏色條
        setChartMin(minmax[1])
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          visible: data.value,
          pointType: 'circle+text',
          // Styles
          filled: true,
          getText: f => f.properties['STATION'],
          getTextAlignmentBaseline: 'bottom',
          getTextAnchor: 'start',
          getTextSize: 12,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: d => fillcolorGNSS(d, idx, timeSeriesMinMax),
          textCharacterSet: "auto",
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          filterEnabled: false,
          getFilterValue: getFilterValue,
          filterTransformSize: true,
          filterTransformColor: true,
          filterRange: [0, 0],
          // Define extensions
          extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
          onClick: onClick,
          updateTriggers: {
            getFilterValue: getFilterValue,
            visible: data.value,
          }
        })
      }

      else if(element.props.name === data.name && checkIsGNSS(data.name)){
        let idx = findTimeSeriesMinMaxIndex(data.name, timeSeriesMinMax)
        let minmax = []
        minmax = findMinMax(data.data.features)
        setChartIsVisible(value)  //地圖右邊的顏色條
        setChartMin(minmax[1])
        setChartMax(minmax[0])
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          data_type: newMapData[index1].name,
          visible: value,
          pointType: "circle+text",
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: d => fillcolorGNSS(d, idx, timeSeriesMinMax),
          getText: f => f.properties['STATION'],
          getTextAlignmentBaseline: 'bottom',
          getTextAnchor: 'start',
          getTextSize: 12,
          stroked: false,
          lineWidthMinPixels: 3,
          getLineColor: getDotColor(data),
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          onClick: onClick,
          updateTriggers: {
            visible: data.value
          }
        })
        return;
      }

      // 地下水觀測井位置圖資料
      else if (element.props.name === data.name && data.name.includes("地下水觀測井位置圖")) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          data_type: newMapData[index1].name,
          visible: value,
          pointType: "circle+text",
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getText: f => f.properties['NAME_C'],
          getTextAlignmentBaseline: 'bottom',
          getTextAnchor: 'start',
          getTextSize: 12,
          getFillColor: getDotColor(data),
          stroked: false,
          lineWidthMinPixels: 3,
          getLineColor: getDotColor(data),
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          onClick: onClick,
          updateTriggers: {
            visible: data.value
          }
        })
        return;
      }
      //普通資料
      else if (element.props.name === data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層

        //時序資料
        if (data.time_serie) {
          let measurementMap = new Map();
          data.data.features.forEach((da) => {
            let value = measurementMap.get(da.properties._measurement)
            //value.push(da)
            measurementMap.set(da._measurement, value);
          })
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: data.value,
            data_type: newMapData[index1].name,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            stroked: false,
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            filterEnabled: false,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,
            filterRange: [0, 0],
            // Define extensions
            extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
            onClick: onClick,
            updateTriggers: {
              visible: data.value,
              getFilterValue: getFilterValue,
            }
          })
        } else {
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            data_type: newMapData[index1].name,
            visible: value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            stroked: false,
	          lineWidthMinPixels: 3,
            getLineColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            updateTriggers: {
              visible: data.value
            }
          })
        }

      }
    });
    setLayers(newLayer) //修改本來地圖的layer */ 
  }

  //當初始化時執行一次下面的程式
  useEffect(() => {
    setMode(0)
    GNSSList().then((res) => {
      setGnssList(res.data.data)
    }).catch((err) => {
    }).finally(() => {
    })
  }, [])
  //當gnssList變化時執行下面的程式
  useEffect(() => {     //run when gnssList is changed
    LayerList().then((res) => {
      let resultArr = []
      res.data.data.forEach((element, idx) => {
        resultArr.push([element, false])
      })
      setDatabaseName(resultArr)
      setDataLoadState(1)
    }).catch((err) => {
    }).finally(() => {
      
    })
    
  },[gnssList])


  let DatabaseList = databaseName.map((d, index) =>
    <div className={styles.layerNameCheckBox}>
      <InputWrapper>
        <Checkbox
          checked={d[1]}    
          value = {d[0]}
          onChange={onChangeCheckItems}
          color="default"
        />
        <StyledLabel>
          <div>
            {d}
          </div>
        </StyledLabel>
      </InputWrapper>
    </div>
  );

  let BtnList = allData.map((d, index1) =>
    <div>
      <Accordion square defaultExpanded>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>{d.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.flex_column}>
            {
              d.files.map((data, index) =>
                <CheckItem currentLayer={getLayer(data)} setCurrentLayer={(time) => setCurrentLayer(data, index1, time, index)} originData={originData} data={data} onChange={(e) => OnListItemsChange(e, index1, data, index)} />
              )
            }
          </div>

        </AccordionDetails>
      </Accordion>
    </div>
  );

  return (
    <div>
      <h4 className={styles.func_title}>{t('layer')}</h4>
      {
        dataLoadState == 0 &&
        <div className={styles.loading}>
          <LinearProgress variant="determinate" value={dataLoadStateProgess} />
        </div>
      }
      <div className={styles.circle_analysis_btn}>
        <Button
          onClick={(e) => setFullLayer()}
          variant={mode === 0 ? "contained" : "outlined"}        
        >
          {t('full_data')}
        </Button>
        <Button
          onClick={(e) => setChoushuiEditLayer()}
          variant={mode === 1 ? "contained" : "outlined"}
        >
          {t('part_data')}
        </Button>
      </div>
      {
        dataLoadState == 1 &&
        <div>
          <div className={styles.layerNameCheckBoxWrapper}>
            <div className={styles.layerNameTextWrapper}>
              {DatabaseList}
            </div>
            <div>
              <Button className= "mt-3" onClick={LayerNameOnClick} variant="contained">
                {t('send')}
              </Button>
            </div>
          </div>
          {BtnList}
        </div>
      }
    </div>
  )


}
