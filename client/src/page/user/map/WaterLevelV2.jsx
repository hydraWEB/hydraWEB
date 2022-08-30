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
import * as d3 from 'd3';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { saveAs } from 'file-saver';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import SearchIcon from '@material-ui/icons/Search';
import Popover from '@mui/material/Popover';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import * as savesvg from 'save-svg-as-png';
import { WaterLevelAllStations, WaterLevelGetDataByStNo,WaterLevelDownloadByStNo } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import * as dayjs from 'dayjs'

import axios from 'axios';
//時序資料功能的函式
export default function WaterLevel({STNO, buttonClickedFlag, setButtonClickedFlag}) {

  const [allStation, setAllStation] = useState([])
  const [combineAllStation, setCombineAllStation] = useState([])
  const [currentStation, setCurrentStation] = useState(null) //點選後存起來的下拉選單資料
  const [currentStationIndex, setCurrentStationIndex] = useState(null) //水位資料的index
  const [currentStationData, setCurrentStationData] = useState(null) //水位資料
  const [currentStationAverageData, setCurrentStationAverageData] = useState(null) //水位資料
  const [allTimeSeriesData, setAllTimeSeriesData] = useState(["水位","雲林抽水","彰化抽水"])
  const [currentTimeSerieData, setCurrentTimeSerieData] = useState(null) //選擇的時序資料
  const [openpop, setOpenpop] = useState(null)
  const [isLoadingStation, setLoadingStation] = useState(true)
  const [isLoadingData, setLoadingData] = useState(false)
  const [isInitialize, setIsInitialize] = useState(true)
  const { t, i18n } = useTranslation();

  const [avgDayOptions, setAvgDayOptions] = useState([])

  const [minHourOptions, setMinHourOptions] = useState([])
  const [maxHourOptions, setMaxHourOptions] = useState([])
  const [avgHourOptions, setAvgHourOptions] = useState([])
  
  const [minMinuteOptions, setMinMinuteOptions] = useState([])
  const [maxMinuteOptions, setMaxMinuteOptions] = useState([])
  const [avgMinuteOptions, setAvgMinuteOptions] = useState([])

  const [minDate, setMinDate] = useState()                      //該站點最小的時間
  const [maxDate, setMaxDate] = useState()                      //該站點最大的時間
  const [avgDay, setAvgDay] = useState(0)                      //該站點平均的時間

  const [minTimeDatePicker, setMinTimeDatePicker] = useState()  //最小時間的value
  const [maxTimeDatePicker, setMaxTimeDatePicker] = useState()  //最大時間的value

  const [minHour, setMinHour] = useState(0)
  const [maxHour, setMaxHour] = useState(0)
  const [avgHour, setAvgHour] = useState(0)

  const [minMinute, setMinMinute] = useState(0)
  const [avgMinute, setAvgMinute] = useState(0)
  const [maxMinute, setMaxMinute] = useState(0)

  const [isAverage, setIsAverage] = useState(false)
  

  const { addToast } = useToasts();
  const url = "http://localhost:8086"
  const token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg=="
  const org = "hydraweb"
  const bucket = "test"
  //透過站點名稱尋找存取的陣列裡的位置的函式
  function FindIndexOfSTNO(name){
    if(name === "水位"){
      for (let i = 0;i<combineAllStation[0].length;i++){
        if(combineAllStation[0][i]["data"][0] === STNO){
          let idx = i;
          return idx
        }
      }
    }
    
    return 0
  }

 
  let dayjs = require("dayjs")
  //初始化時執行一次裡面的程式，通過後端取得資料
  useEffect(() => {
    WaterLevelAllStations().then((res) => {
      addToast(t('water_level_loading_success'), { appearance: 'success', autoDismiss: true });
      setAllStation(res.data.data)
      setCombineAllStation(res.data.data)
      setCurrentTimeSerieData("水位")   //initialize
    }).catch((err) => {
      addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
      setLoadingStation(false);
    })
  }, [])
  //每當combineAllStation有變化時執行裡面的函式
  useEffect(() => {
    if(allStation.length > 0){
      //不是透過點擊資訊欄裡的水位資料按鈕跳轉到時序資料功能裡就執行下面的程式
      //預設陣列的第一筆資料
      if(STNO === ""){
        FindMinMaxTime(0,"full_data")
        /* for(let i = 0; i < allStation.length; i++){
          if(allStation[i]["name"] === "full_data"){
            setCurrentStation(allStation[i]["data"][0])
            setCurrentStationIndex(i)
            break
          }
        } */
        setCurrentStation(combineAllStation[0][0]['data'][0])
        setCurrentStationIndex(0)
      }
      //是透過點擊資訊欄裡的水位資料按鈕跳轉到時序資料功能裡就執行下面的程式
      //預設成站點名稱的資料
      else{
        let idx = FindIndexOfSTNO("水位")
        FindMinMaxTime(idx,"full_data")
        setCurrentStation(combineAllStation[0][idx]["data"][0])
        setCurrentStationIndex(idx)
      }
      
    }
  }, [combineAllStation])
  //每當isLoadingStation有變化時執行下面的函式
  useEffect(() => {
    //是透過點擊資訊欄裡的水位資料按鈕跳轉到時序資料功能裡就執行下面的程式
    //點擊搜尋按鈕
    if(STNO !== "" && STNO !== undefined && buttonClickedFlag && !isLoadingStation){
      document.getElementById('seachClickTrigger').click()
      setButtonClickedFlag(false)
    }
  }, [isLoadingStation])
  //點擊搜尋按鈕執行的函式
  const onSearchClick = (e) => {
    setIsInitialize(false)
    if(STNO != ""){
      setCurrentStation(STNO)
    }
    let currStation = currentStation
    let time_is_valid = timeIsValid()
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
    dayjs.extend(utc)
    dayjs.extend(timezone)
    let minDateUnix = parseInt((minTimeDatePicker.getTime() / 1000).toFixed(0)) + parseInt(minHour)*3600
    let maxDateUnix = parseInt((maxTimeDatePicker.getTime() / 1000).toFixed(0)) + parseInt(maxHour)*3600
    console.log(minDateUnix)
    console.log(maxDateUnix)
    let start_datetime = dayjs.unix(minDateUnix)
    let end_datetime = dayjs.unix(maxDateUnix)
    console.log(start_datetime)
    console.log(end_datetime)
    //如果時間沒問題執行下面的程式
    if (time_is_valid) {
      let stationDataArr = []
      let stationDataAverageArr = []
      DrawEmptyChart()
      setLoadingData(true)
      var start = dayjs()
      console.log("start")
      console.log(start)
      var bodyToSend = ""
      var bodyToSendAvg = ""
      if(currentTimeSerieData === "水位"){
        bodyToSend = `from(bucket:"full_data") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "Water_Level" and r["ST_NO"] == "${combineAllStation[0][currentStationIndex]["data"][0]}")`
      }
      else if (currentTimeSerieData === "雲林抽水"){
        bodyToSend = `from(bucket:"pumping_station_yunlin") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998 and r["_measurement"] == "${combineAllStation[1][currentStationIndex]["data"][0]}")`
      }
      else if (currentTimeSerieData === "彰化抽水"){
        bodyToSend = `from(bucket:"pumping_station_changhua") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998 and r["_measurement"] == "${combineAllStation[2][currentStationIndex]["data"][0]}")`
      }
      //如果沒有設定到平均時間就執行下面的程式
      if(avgDay === 0 && avgHour === 0 && avgMinute === 0){
        setIsAverage(false)
        fetch("http://140.121.196.77:30180/influxdb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/json",
            "Authorization":"Token b0W9OqcWgFhiGqhvqoWi6w4FvfeFlJWgwLuWZc_yo70ZtEMntCppgnVpTKnngr836R68rJBmSaLc_2JWrK5iBA==",
            "Content-Type": "application/vnd.flux"
          }),
          body:bodyToSend
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
          //只選出需要的資料
          for (let i = 1; i < lines.length; i++){
            let arr = []
            let splitedline = lines[i].split(",")
            arr.push(splitedline[5])
            arr.push(parseFloat(splitedline[6]))
            stationDataArr.push(arr)
          }
          setCurrentStationData(stationDataArr)
        }).finally(() => {
          setLoadingData(false)
        })
      }
      //如果有設定到平均時間就執行下面的程式
      else {
        setIsAverage(true)
        let totalMin = avgDay*1440 + avgHour*60 + avgMinute
        if(currentTimeSerieData === "水位"){
          bodyToSendAvg = `from(bucket:"full_data") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998 and r["ST_NO"] == "${combineAllStation[0][currentStationIndex]["data"][0]}") |> timedMovingAverage(every: ${totalMin}m, period: ${totalMin}m)`
        }
        else if (currentTimeSerieData === "雲林抽水"){
          bodyToSendAvg = `from(bucket:"pumping_station_yunlin") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998 and r["_measurement"] == "${combineAllStation[1][currentStationIndex]["data"][0]}") |> timedMovingAverage(every: ${totalMin}m, period: ${totalMin}m)`
        }
        else if (currentTimeSerieData === "彰化抽水"){
          bodyToSendAvg = `from(bucket:"pumping_station_changhua") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998 and r["_measurement"] == "${combineAllStation[2][currentStationIndex]["data"][0]}") |> timedMovingAverage(every: ${totalMin}m, period: ${totalMin}m)`
        }
        //fetch InfluxDB data with average constant
        fetch("http://140.121.196.77:30180/influxdb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/json",
            "Authorization":"Token b0W9OqcWgFhiGqhvqoWi6w4FvfeFlJWgwLuWZc_yo70ZtEMntCppgnVpTKnngr836R68rJBmSaLc_2JWrK5iBA==",
            "Content-Type": "application/vnd.flux"
          }),
          body:bodyToSendAvg
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
          //只選出需要的資料
          for (let i = 1; i < lines.length-2; i++){
            let arr = []
            let splitedline = lines[i].split(",")
            arr.push(splitedline[splitedline.length-1].substring(0, splitedline[splitedline.length-1].length - 2))
            arr.push(parseFloat(splitedline[splitedline.length-2]))
            stationDataAverageArr.push(arr)
          }
          setCurrentStationAverageData(stationDataAverageArr)
        })
        //fetch InfluxDB data without average constant
        fetch("http://140.121.196.77:30180/influxdb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/json",
            "Authorization":"Token b0W9OqcWgFhiGqhvqoWi6w4FvfeFlJWgwLuWZc_yo70ZtEMntCppgnVpTKnngr836R68rJBmSaLc_2JWrK5iBA==",
            "Content-Type": "application/vnd.flux"
          }),
          body:bodyToSend
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
          //只選出需要的資料
          for (let i = 1; i < lines.length; i++){
            let arr = []
            let splitedline = lines[i].split(",")
            arr.push(splitedline[5])
            arr.push(parseFloat(splitedline[6]))
            stationDataArr.push(arr)
          }
          setCurrentStationData(stationDataArr)
        }).finally(() => {
          setLoadingData(false)
        })
      }
    }
    else {
      alert("Minimum time must be smaller than Maximum time")
    }
  }
  //每當currentStationData或currentStationAverageData有變化時執行下面的程式
  useEffect(() => {
    if(isAverage){
      if(currentStationData !== null && currentStationAverageData !== null){
        DrawChart()
      }
    }
    else{
      if (currentStationData !== null) {
        DrawChart()
      }
    }
    
  }, [currentStationData, currentStationAverageData])
  //繪製空的圖表，用來覆蓋掉之前的圖表
  function DrawEmptyChart() {
    d3.select("#LineChart").html("");
    const svg = d3.select("#LineChart")
  }
  //每當選擇水位站點有變化時執行的函式
  const waterstationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "full_data")
    setCurrentStation(combineAllStation[0][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  }
  //每當選擇雲林抽水站點有變化時執行的函式
  const pumping_YunlinstationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "Pumping_Yunlin")
    setCurrentStation(combineAllStation[1][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  } 
  //每當選擇彰化抽水站點有變化時執行的函式 
  const pumping_ChanghuastationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "Pumping_Changhua")
    setCurrentStation(combineAllStation[2][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  }
  //每當選擇水位、雲林抽水或彰化抽水變化時執行的函式
  const timeSerieSelectOnChange = (e) => {
    console.log(e.target.value)
    setCurrentTimeSerieData(e.target.value)
    let val = ""
    if (e.target.value === "彰化抽水") val = "Pumping_Changhua"
    else if (e.target.value === "雲林抽水") val = "Pumping_Yunlin"
    else if (e.target.value === "水位") val = "full_data"
    FindMinMaxTime(currentStationIndex, val)
  }
  //檢查選擇的時間是否正確
  function timeIsValid() {

    let minDateUnix = parseInt((minTimeDatePicker.getTime() / 1000).toFixed(0))
    /* let minHourUnix = parseInt((minHour.getTime() / 1000).toFixed(0)) */
    let maxDateUnix = parseInt((maxTimeDatePicker.getTime() / 1000).toFixed(0))
    /* let maxHourUnix = parseInt((maxHour.getTime() / 1000).toFixed(0)) */
    if (minDateUnix > maxDateUnix) {
      return false
    }
    else if (minDateUnix === maxDateUnix){
      if (parseInt(minHour) > parseInt(maxHour)) {
        return false
      }
    }
    return true
  }
  //修改influx回傳回來的資料，將<9998的資料改成NaN
  function filterInfluxData(data){
    let newarr = []
    if(data === null) return newarr
    for (let i = 0;i<data.length;i++){
      if(data[i][1] > -9998){
        newarr.push(data[i])
      }
      else{
        newarr.push([data[i][0], NaN])
      }
    }
    return newarr
  }
  //找出該該陣列裡index的最大最小的時間
  function FindMinMaxTime(index,name) {
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
    dayjs.extend(utc)
    dayjs.extend(timezone)
    let minTime = 0
    let maxTime = 0
    if(name === "full_data"){
      minTime = dayjs(combineAllStation[0][index]["data"][2]).tz("Etc/GMT")
      maxTime = dayjs(combineAllStation[0][index]["data"][3]).tz("Etc/GMT")
    }
    else if (name === 'Pumping_Yunlin'){
      minTime = dayjs(combineAllStation[1][index]["data"][2]).tz("Etc/GMT")
      maxTime = dayjs(combineAllStation[1][index]["data"][3]).tz("Etc/GMT")
    }
    else if (name === 'Pumping_Changhua'){
      minTime = dayjs(combineAllStation[2][index]["data"][2]).tz("Etc/GMT")
      maxTime = dayjs(combineAllStation[2][index]["data"][3]).tz("Etc/GMT")
    }
    let minYear = minTime.year();
    let maxYear = maxTime.year();
    let minMonth = minTime.month();
    let maxMonth = maxTime.month();
    let minDay = minTime.date();
    let maxDay = maxTime.date();
    let minHour = minTime.hour();
    let maxHour = maxTime.hour();
    let hourArr = []
    let minuteArr = []
    let avgDayArr = []
    for (let i = 0; i < 24; i++) {
      hourArr.push(i)
    }
    for (let i = 0;i<60;i++){
      minuteArr.push(i)
    }
    for (let i = 0;i<100;i++){
      avgDayArr.push(i)
    }
    setMinHourOptions(hourArr)
    setMaxHourOptions(hourArr)
    setAvgHourOptions(hourArr)

    setMinMinuteOptions(minuteArr)
    setMaxMinuteOptions(minuteArr)
    setAvgMinuteOptions(minuteArr)

    setAvgDayOptions(avgDayArr)
    
    setMinDate(new Date(minYear, minMonth, minDay))
    setMaxDate(new Date(maxYear, maxMonth, maxDay))
    setMinTimeDatePicker(new Date(minYear, minMonth, minDay))
    setMaxTimeDatePicker(new Date(maxYear, maxMonth, maxDay))
  }
  //繪製圖表，使用d3.js繪製
  function DrawChart() {
    d3.select("#LineChart").html("");
    const margin = { top: 30, right: 0, bottom: 30, left: 55 },
      width = 1650 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#LineChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .style('background-color', 'white')
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    let dataset = null
    let filteredCurrentStationData = []
    let filteredCurrentStationAverageData = []
    filteredCurrentStationData = filterInfluxData(currentStationData)
    filteredCurrentStationAverageData = filterInfluxData(currentStationAverageData)
    
    let dataset2 = []
    if(isAverage){
      dataset = filteredCurrentStationData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
      dataset2 = filteredCurrentStationAverageData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
    }
    
    else{
      dataset = filteredCurrentStationData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
    }

    svg.append("text")
      .attr("class", "x label")
      .attr("x", -10)
      .attr("y", -10)
      .text("meter");
    

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    const focusDate = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr("r", 7.5);

    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    focusDate.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");
    
    const focus2 = svg.append('g')
      .attr('class', 'focus2')
      .style('display', 'none');

    const focusDate2 = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus2.append('circle')
      .attr("r", 7.5);

    focus2.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    focusDate2.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(dataset, function (d) { return d.x; }))
      .range([0, width]);
    var xAxis = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([d3.min(dataset, function (d) { return d.y }), d3.max(dataset, function (d) { return d.y; })])
      .range([height, 0]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    const line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
      .datum(dataset)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
        .defined(function (d) { return d.y; })
      )

    line.append("path")
      .datum(dataset2)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      
      .attr("d", d3.line()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
        .defined(function (d) { return d.y; })
      )

    // Add the brushing
    line
      .append("g")
      .attr("class", "brush")
      .call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event, d) {

      // What are the selected boundaries?
      var extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4, 8])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));
      line
        .selectAll('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function (d) { return x(d.x) })
          .y(function (d) { return y(d.y) })
          .defined(function (d) { return d.y; })
        )
    }

    svg.on('mouseover', () => {
      focus.style('display', null);
      focusDate.style('display', null);
      if(isAverage){
        focus2.style('display', null)
        focusDate2.style('display', null)
      }
      
    })
      .on('mouseout', () => {
        focus.style("display", "none");
        focusDate.style('display', "none");
        focus2.style("display", "none");
        focusDate2.style('display', "none");
      })
      .on('mousemove', e => { // mouse moving over canvas

        let length = dataset.length
        let length2 = dataset2.length
        let w = 1593.977294921875 - 0.20454709231853485
        let calc = w / length
        let calc2 = w / length2
        var mouse = d3.pointer(e)
        var bisectDate = d3.bisector(function(d) {return d.x}).left;
        let nearest_x_idx = bisectDate(dataset, x.invert(mouse[0]))

        let x_location = Math.floor((mouse[0] + 0.20454709231853485) / calc)
        let x_location2 = Math.floor((mouse[0] + 0.20454709231853485) / calc2)
        if (x_location === length) x_location -= 1;
        if (x_location2 === length2) x_location2 -= 1;
        if (dataset[x_location] !== undefined) {
          focus.attr("transform", "translate(" + x(dataset[nearest_x_idx]['x']) + "," + y(dataset[nearest_x_idx]['y']) + ")");
          focusDate.attr("transform", "translate(" + x(dataset[nearest_x_idx]['x']) + "," + y(dataset[nearest_x_idx]['y']) + ")");
          focus.select("text").text(function () { return dataset[nearest_x_idx]["y"] });
          focusDate.select("text").text(function () { return dayjs(dataset[nearest_x_idx]["x"]).format('YYYY MMM DD ddd HH:mm:ss') });
          if (x_location > (length * 0.95)) {
            focus.select("text")
              .attr("stroke", "green")
              .attr("x", -50)
              .attr("y", -20);
            focusDate.select("text")
              .attr("stroke", "green")
              .attr("x", -390)
              .attr("y", -40);
          }
          else {
            focus.select("text")
              .attr("stroke", "green")
              .attr("x", 0)
              .attr("y", -20);
              focusDate.select("text")
              .attr("stroke", "green")
              .attr("x", 0)
              .attr("y", -40);
          }
        }
        if (dataset2[x_location2] !== undefined && isAverage) {
          let nearest_x_idx2 = bisectDate(dataset2, x.invert(mouse[0]))
          focus2.attr("transform", "translate(" + x(dataset2[nearest_x_idx2]['x']) + "," + y(dataset2[nearest_x_idx2]['y']) + ")");
          focusDate2.attr("transform", "translate(" + x(dataset2[nearest_x_idx2]['x']) + "," + y(dataset2[nearest_x_idx2]['y']) + ")");
          focus2.select("text").text(function () { return dataset2[nearest_x_idx2]["y"] });
          focusDate2.select("text").text(function () { return dayjs(dataset2[nearest_x_idx2]["x"]).format('YYYY MMM DD ddd HH:mm:ss') });
          if (x_location2 > (length2 * 0.75)) {
            focus2.select("text")
              .attr("stroke", "red")
              .attr("x", -50)
              .attr("y", 40);
            focusDate2.select("text")
              .attr("stroke", "red")
              .attr("x", -390)
              .attr("y", 20);
          }
          else {
            focus2.select("text")
              .attr("stroke", "red")
              .attr("x", 0)
              .attr("y", 40);
            focusDate2.select("text")
              .attr("stroke", "red")
              .attr("x", 0)
              .attr("y", 20);
          }
        }


        //focus.select(".x-hover-line").attr("y2", mouse[0]);
        //focus.select(".y-hover-line").attr("x2", mouse[1]);
      });
    //點擊滑鼠兩下恢復成原來的圖表
    svg.on("dblclick", function () {
      if(!isAverage){
        x.domain(d3.extent(dataset, function (d) { return d.x; }))
        xAxis.transition().call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));
        line
          .selectAll('.line')
          .transition()
          .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
            .defined(function (d) { return d.y; })
          )
      }
      else{
        x.domain(d3.extent(dataset, function (d) { return d.x; }))
        x.domain(d3.extent(dataset2, function (d) { return d.x; }))
        xAxis.transition().call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));
        line
          .selectAll('.line')
          .transition()
          .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
            .defined(function (d) { return d.y; })
          )
      }
    });
    //下載按鈕
    d3.select('#saveButton').on('click', function () {
      //savesvg.saveSvgAsPng(svg.node(), "plot.png");
      savesvg.saveSvgAsPng(d3.select('#LineChart > svg').node(), combineAllStation[0][currentStationIndex]["data"][0]+".png", {backgroundColor: "#FFFFFF"});
    });


  }

  let selectTimeSerie = allTimeSeriesData.map((d, index) =>
    <option value={d}>{d}</option>
  );
  var selectWaterStation,selectChanghuaPumpingStation,selectYunlinPumpingStation
  if(combineAllStation.length > 0){
    selectWaterStation = combineAllStation[0].map((d, index) =>
      <option value={index}>{`${d["data"][0]} ${d["data"][1]}`}</option>
    );
    selectChanghuaPumpingStation = combineAllStation[2].map((d, index) =>
      <option value={index}>{`${d["data"][0]}`}</option>
    );
    selectYunlinPumpingStation = combineAllStation[1].map((d, index) =>
      <option value={index}>{`${d["data"][0]}`}</option>
    );
  }

/*   let selectStation = allStation.map((d, index) =>
    <option value={index}>{`${d["data"][0]} ${d["data"][1]}`}</option>
  ); */
  //min,max,avg hour
  let selectMinHour = minHourOptions.map((d) =>
    <option value={d}>{d}</option>
  );
  let selectMaxHour = maxHourOptions.map((d) =>
    <option value={d}>{d}</option>
  );
  let selectAvgHour = avgHourOptions.map((d) =>
  <option value={d}>{d}</option>
  );
  //min,max,avg minute
  let selectMaxMinute = maxMinuteOptions.map((d) =>
    <option value={d}>{d}</option>
  );
  let selectMinMinute = minMinuteOptions.map((d) =>
  <option value={d}>{d}</option>
  );
  let selectAvgMinute = avgMinuteOptions.map((d) =>
  <option value={d}>{d}</option>
  );
  //avg day
  let selectAvgDay = avgDayOptions.map((d) =>
  <option value={d}>{d}</option>
  );
  //點擊幫助按鈕後執行的函式
  const handlePopClick = (event) => {
    setOpenpop(event.currentTarget);
  }
  //點擊下載按鈕後執行的函式
  const handleDownloadClick = (event) => {
    if(STNO !== ""){
      setCurrentStation(STNO)
    }
    let time_is_valid = timeIsValid()
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
    dayjs.extend(utc)
    dayjs.extend(timezone)
    let minDateUnix = parseInt((minTimeDatePicker.getTime() / 1000).toFixed(0)) + parseInt(minHour)*3600 + parseInt(minMinute)*60
    let maxDateUnix = parseInt((maxTimeDatePicker.getTime() / 1000).toFixed(0)) + parseInt(maxHour)*3600 + parseInt(maxMinute)*60
    let start_datetime = dayjs.unix(minDateUnix)
    let end_datetime = dayjs.unix(maxDateUnix)
    console.log(start_datetime)
    console.log(end_datetime)
    let val = 0
    if(currentTimeSerieData === "水位"){
      val = 0
    }
    else if (currentTimeSerieData === "雲林抽水"){
      val = 1
    }
    else if (currentTimeSerieData === "彰化抽水"){
      val = 2
    }
    if (time_is_valid) {
      WaterLevelDownloadByStNo({
        st_no: combineAllStation[val][currentStationIndex]["data"][0],
        time_series: currentTimeSerieData,
        start_time:start_datetime,
        end_time:end_datetime,
        avg_day:avgDay,
        avg_hour:avgHour,
        avg_minute:avgMinute
      }).then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          'FileName.csv'    //download name
        )
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }).catch((err) => {
        addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
      }).finally(() => {
      })
    }
    else {
      alert("Minimum time must be smaller than Maximum time")
    }
  }
  //顯示圖表上面的資訊
  function ShowInfo() {
    if (!isAverage){
      return (
        <div className={styles.info_layout}>
          <div className={styles.info_layout_left}>
            <div className={styles.square_green}/>
          </div>
          <div className={styles.info_layout_right}>
            原本數據
          </div>
        </div>
      )
    }else{
      return (
        <div className={styles.info_layout}>
          <div className={styles.info_layout_top}>
            <div className={styles.info_layout_left}>
              <div className={styles.square_green}/>
            </div>
            <div className={styles.info_layout_right}>
              原本數據
            </div>
          </div>
          <div className={styles.info_layout_bot}>
            <div className={styles.info_layout_left}>
              <div className={styles.square_red}/>
            </div>
            <div className={styles.info_layout_right}>
              修改數據(假設)
            </div>
          </div>
        </div>
      )
    }
  }
  //判斷是水位、雲林抽水或彰化抽水並顯示相應的資料
  function ShowAllStation(name){   //顯示目前選擇的時序資料
    if(name.name === "水位"){
      return (
        <div className={styles.wl_left_1}>
          <h5>{t('select_area')}</h5>
          <Select
            native
            value={currentStationIndex}
            onChange={waterstationSelectOnChange}
          >
            {selectWaterStation}
          </Select>
        </div>
      )
    }
    else if (name.name === "雲林抽水"){
      return (
        <div>
          <div className={styles.wl_left_1}>
            <h5>{t('select_area')}</h5>
            <Select
              native
              value={currentStationIndex}
              onChange={pumping_YunlinstationSelectOnChange}
            >
              {selectYunlinPumpingStation}
            </Select>
          </div>
        </div>
      )
    }
    else if (name.name === "彰化抽水"){
      return (
        <div>
          <div className={styles.wl_left_1}>
            <h5>{t('select_area')}</h5>
            <Select
              native
              value={currentStationIndex}
              onChange={pumping_ChanghuastationSelectOnChange}
            >
              {selectChanghuaPumpingStation}
            </Select>
          </div>
        </div>
      )
    }
    else{
      return (
        <div></div>
      )
    }
  }

  //關閉幫助按鈕的視窗
  const handleClose = () => {
    setOpenpop(null);
  };
  const open = Boolean(openpop);
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <h4 className={styles.func_title}>{t('time_series_data')}</h4>
      {isLoadingStation ?
        <img
          className={styles.loading_image}
          src="/img/loading.svg"
        />
        :
        <div className={styles.water_level_layout}>
          <div className={styles.water_level_layout_left}>
            <Select
              native
              value={currentTimeSerieData}
              onChange={timeSerieSelectOnChange}
            >
              {selectTimeSerie}
            </Select>
            <div className={styles.function_wrapper_waterlevel}>
              <div className={styles.water_level_dropdown}>
                <h5>{t('select_coordinate')}</h5>
                <ShowAllStation name ={currentTimeSerieData}/>
                <div className={styles.wl_left_1}>
                  <h5>{t('select_min_time')}</h5>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={minTimeDatePicker}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newValue) => {
                        setMinTimeDatePicker(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <div className={styles.wl_left_1_container}>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={minHour}
                        onChange={(newValue) => {
                          setMinHour(newValue.target.value)
                        }}
                      >
                        {selectMinHour}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>h</span>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={minMinute}
                        onChange={(newValue) => {
                          setMinMinute(newValue.target.value)
                        }}
                      >
                        {selectMinMinute}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>M</span>
                  </div>
                </div>

                <div className={styles.wl_left_1}>
                  <h5>{t('select_max_time')}</h5>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={maxTimeDatePicker}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newValue) => {
                        setMaxTimeDatePicker(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>

                  <div className={styles.wl_left_1_container}>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={maxHour}
                        onChange={(newValue) => {
                          setMaxHour(newValue.target.value)
                        }}
                      >
                        {selectMaxHour}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>h</span>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={maxMinute}
                        onChange={(newValue) => {
                          setMaxMinute(newValue.target.value)
                        }}
                      >
                        {selectMaxMinute}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>m</span>
                  </div>
                  
                </div>

                <div className={styles.wl_left_1}>
                  <h5>{t('select_avg_time')}</h5>
                  <div className={styles.wl_left_1_container}>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={avgDay}
                        onChange={(newValue) => {
                          setAvgDay(parseInt(newValue.target.value))
                        }}
                      >
                        {selectAvgDay}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>d</span>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={avgHour}
                        onChange={(newValue) => {
                          setAvgHour(parseInt(newValue.target.value))
                        }}
                      >
                        {selectAvgHour}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>h</span>
                    <div className={styles.wl_left_1_container_div}>
                      <Select
                        native
                        value={avgMinute}
                        onChange={(newValue) => {
                          setAvgMinute(parseInt(newValue.target.value))
                        }}
                      >
                        {selectAvgMinute}
                      </Select>
                    </div>
                    <span className={styles.wl_left_1_container_text}>m</span>
                  </div>
                </div>
                <Button id="seachClickTrigger" className="mt-2" variant="outlined" type="submit" aria-label="search" onClick={onSearchClick} startIcon={<SearchIcon />}>
                  {t('search')}
                </Button>
                <Button className="mt-2 ml-2" variant="contained" onClick={handleDownloadClick}>{t('download')}</Button>
                <Button className="mt-2 ml-2" variant="contained" id='saveButton'>列印</Button>
                <Button className="mt-2 ml-2" variant="contained" onClick={handlePopClick}>{t('help')}</Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={openpop}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>Brush the chart to zoom.Double click to re-initialize</Typography>
                </Popover>

              </div>
            </div>
           
          </div>
          <div>
            {!isInitialize &&
              <ShowInfo/>
            }
          </div>
          <div className={styles.water_level_layout_right}>
            {isLoadingData &&
              <div className={styles.wl_loading_container}>
                <img
                  className={styles.loading_image_2}
                  src="/img/loading.svg"
                />
                <h5>{t('loading')}...</h5>
              </div>
            }
            <div id="LineChart" className={styles.water_level_graph} />
          </div>
          
        </div>
      }
    </div>
  );
};
