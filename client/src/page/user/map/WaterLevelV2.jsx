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
import { WaterLevelAllStations, WaterLevelGetDataByStNo,WaterLevelDownloadByStNo } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import * as dayjs from 'dayjs'

import axios from 'axios';

export default function WaterLevel({STNO}) {

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

  function FindIndexOfSTNO(){
    for (let i = 0;i<allStation.length;i++){
      if(allStation[i]["data"][0] === STNO){
        let idx = i;
        return idx
      }
    }
    return 0
  }

  function SplitAllStation(data){
    var begin_changhua = 0, begin_yunlin = 0, begin_water = 0
    var end_changhua = -1, end_yunlin = -1, end_water = -1
    if(data[0]['name'] === 'full_data') {
      begin_water = 0
    }
    else if(data[0]['name'] === 'Pumping_Changhua') {
      begin_changhua = 0
    }
    else if(data[0]['name'] === 'Pumping_Yunlin') {
      begin_yunlin = 0
    }
    for (let i = 1; i < data.length; i++){
      if(data[i]['name'] === 'full_data' && data[i-1]['name'] !== 'full_data'){
        begin_water = i
      }
      else if(data[i]['name'] === 'Pumping_Changhua' && data[i-1]['name'] !== 'Pumping_Changhua'){
        begin_changhua = i
      }
      else if(data[i]['name'] === 'Pumping_Yunlin' && data[i-1]['name'] !== 'Pumping_Yunlin'){
        begin_yunlin = i
      }
      if(data[i-1]['name'] === 'full_data' && data[i]["name"] !== "full_data"){
        end_water = i-1
      }
      else if(data[i-1]['name'] === 'Pumping_Changhua' && data[i]["name"] !== "Pumping_Changhua"){
        end_changhua = i-1
      }
      else if(data[i-1]['name'] === 'Pumping_Yunlin' && data[i]["name"] !== "Pumping_Yunlin"){
        end_yunlin = i-1
      }
    }
    if (end_water === -1){
      end_water = data.length
    }
    else if (end_changhua === -1){
      end_changhua = data.length
    }
    else{
      end_yunlin = data.length
    }
    var combineAllData = []
    combineAllData.push(data.slice(begin_water,end_water+1))
    combineAllData.push(data.slice(begin_yunlin,end_yunlin+1))
    combineAllData.push(data.slice(begin_changhua,end_changhua+1))
    setCombineAllStation(combineAllData)
  }
 
  let dayjs = require("dayjs")

  useEffect(() => {
    WaterLevelAllStations().then((res) => {
      addToast(t('water_level_loading_success'), { appearance: 'success', autoDismiss: true });
      setAllStation(res.data.data)
      SplitAllStation(res.data.data)
      setCurrentTimeSerieData("水位")   //initialize
    }).catch((err) => {
      addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
      setLoadingStation(false);
    })
  }, [])

  useEffect(() => {
    if(allStation.length > 0){
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
  }, [combineAllStation])

  useEffect(() => {
    if(allStation.length > 0 && STNO !==""){
      let idx = FindIndexOfSTNO()
      FindMinMaxTime(idx,"full_data")
      setCurrentStation(allStation[idx]["data"][0])
      setCurrentStationIndex(idx)
    }
  },[STNO])

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
    if (time_is_valid) {
      let stationDataArr = []
      let stationDataAverageArr = []
      DrawEmptyChart()
      setLoadingData(true)
      var start = dayjs()
      console.log("start")
      console.log(start)
      if(avgDay === 0 && avgHour === 0 && avgMinute === 0){
        setIsAverage(false)
        fetch("http://localhost:8086/api/v2/query?org=hydraweb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/vnd.flux",
            "Authorization":"Token 48ajON7zFsezaE5NbYJe4jbEgvYIFCcs07xeUp8xRXiMl7prTQPxeCn2i3bbafPqWibMOD63Bx51G5Y2MvKYkQ==",
            "Content-Type": "application/vnd.flux"
          }),
          body:`from(bucket:"full_data") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998 and r["ST_NO"] == "${allStation[currentStationIndex]["data"][0]}")`
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
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
      else {
        setIsAverage(true)
        let totalMin = avgDay*1440 + avgHour*60 + avgMinute
        //fetch InfluxDB data with average constant
        fetch("http://localhost:8086/api/v2/query?org=hydraweb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/vnd.flux",
            "Authorization":"Token 48ajON7zFsezaE5NbYJe4jbEgvYIFCcs07xeUp8xRXiMl7prTQPxeCn2i3bbafPqWibMOD63Bx51G5Y2MvKYkQ==",
            "Content-Type": "application/vnd.flux"
          }),
          body:`from(bucket:"full_data") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998 and r["ST_NO"] == "${allStation[currentStationIndex]["data"][0]}") |> timedMovingAverage(every: ${totalMin}m, period: ${totalMin}m)`
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
          // ------------------------------------need to fix later -----------------------------------------------------
          for (let i = 1; i < lines.length-2; i++){
            let arr = []
            let splitedline = lines[i].split(",")
            arr.push(splitedline[10].substring(0, splitedline[10].length - 2))
            arr.push(parseFloat(splitedline[9]))
            stationDataAverageArr.push(arr)
          }
          //------------------------------------------------------------------------------------------------------------
          setCurrentStationAverageData(stationDataAverageArr)
        })
        //fetch InfluxDB data without average constant
        fetch("http://localhost:8086/api/v2/query?org=hydraweb", {
          method: "POST",
          headers: new Headers({
            "Accept":"application/vnd.flux",
            "Authorization":"Token 48ajON7zFsezaE5NbYJe4jbEgvYIFCcs07xeUp8xRXiMl7prTQPxeCn2i3bbafPqWibMOD63Bx51G5Y2MvKYkQ==",
            "Content-Type": "application/vnd.flux"
          }),
          body:`from(bucket:"full_data") |> range(start: ${minDateUnix}, stop: ${maxDateUnix}) |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998 and r["ST_NO"] == "${allStation[currentStationIndex]["data"][0]}")`
        }).then(response=>response.text())
        .then(data=>{     
          var end = dayjs()
          console.log("end")
          console.log(end)
          console.log(end-start)
          var lines = data.split("\n")
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
      
      /* WaterLevelGetDataByStNo({
        st_no: allStation[currentStationIndex][0],
        start_time:start_datetime,
        end_time:end_datetime, 
        avg_day:avgDay,
        avg_hour:avgHour,
        avg_minute:avgMinute
      }).then((res) => {
        setCurrentStationData(res.data.data)
      }).catch((err) => {
        addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
      }).finally(() => {
        setLoadingData(false)
      }) */
    }
    else {
      alert("Minimum time must be smaller than Maximum time")
    }
  }

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

  function DrawEmptyChart() {
    d3.select("#LineChart").html("");
    const svg = d3.select("#LineChart")
  }

  const waterstationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "full_data")
    setCurrentStation(combineAllStation[0][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  }

  const pumping_YunlinstationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "full_data")
    setCurrentStation(combineAllStation[1][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  }  
  const pumping_ChanghuastationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value, "full_data")
    setCurrentStation(combineAllStation[2][e.target.value]["data"][0])
    setCurrentStationIndex(e.target.value)
  }

  const timeSerieSelectOnChange = (e) => {
    console.log(e.target.value)
    setCurrentTimeSerieData(e.target.value)
  }

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
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    let dataset = null
    let dataset2 = []

    if(isAverage){
      dataset = currentStationData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
      dataset2 = currentStationAverageData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
    }
    
    else{
      dataset = currentStationData.map((d) => ({
        x: new Date(d[0]),
        y: d[1]
      }));
    }
    

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr("r", 7.5);

    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");
    
    const focus2 = svg.append('g')
      .attr('class', 'focus2')
      .style('display', 'none');

    focus2.append('circle')
      .attr("r", 7.5);

    focus2.append("text")
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
        )
    }

    // If user double click, reinitialize the chart
    svg.on('mouseover', () => {
      focus.style('display', null);
      if(isAverage){
        focus2.style('display', null)
      }
      
    })
      .on('mouseout', () => {
        focus.style("display", "none");
        focus2.style("display", "none");
      })
      .on('mousemove', e => { // mouse moving over canvas

        let length = dataset.length
        let length2 = dataset2.length
        let w = 1593.977294921875 - 0.20454709231853485
        let calc = w / length
        let calc2 = w / length2
        var mouse = d3.pointer(e)
        let x_location = Math.floor((mouse[0] + 0.20454709231853485) / calc)
        let x_location2 = Math.floor((mouse[0] + 0.20454709231853485) / calc2)
        if (x_location === length) x_location -= 1;
        if (x_location2 === length2) x_location2 -= 1;
        if (dataset[x_location] !== undefined) {
          focus.attr("transform", "translate(" + x(dataset[x_location]['x']) + "," + y(dataset[x_location]['y']) + ")");
          focus.select("text").text(function () { return dataset[x_location]["y"] });
          if (x_location > (length * 0.95)) {
            focus.select("text")
              .attr("stroke", "green")
              .attr("x", -50)
              .attr("y", -20);
          }
          else {
            focus.select("text")
              .attr("stroke", "green")
              .attr("x", 0)
              .attr("y", -20);
          }
        }
        if (dataset2[x_location2] !== undefined && isAverage) {
          focus2.attr("transform", "translate(" + x(dataset2[x_location2]['x']) + "," + y(dataset2[x_location2]['y']) + ")");
          focus2.select("text").text(function () { return dataset2[x_location2]["y"] });
          if (x_location2 > (length2 * 0.95)) {
            focus2.select("text")
              .attr("stroke", "red")
              .attr("x", -50)
              .attr("y", -50);
          }
          else {
            focus2.select("text")
              .attr("stroke", "red")
              .attr("x", 0)
              .attr("y", -50);
          }
        }


        //focus.select(".x-hover-line").attr("y2", mouse[0]);
        //focus.select(".y-hover-line").attr("x2", mouse[1]);
      });

    svg.on("dblclick", function () {
      x.domain(d3.extent(dataset, function (d) { return d.x; }))
      x.domain(d3.extent(dataset2, function (d) { return d.x; }))
      xAxis.transition().call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));
      line
        .selectAll('.line')
        .transition()
        .attr("d", d3.line()
          .x(function (d) { return x(d.x) })
          .y(function (d) { return y(d.y) })
        )
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

  const handlePopClick = (event) => {
    setOpenpop(event.currentTarget);
  }

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
    if (time_is_valid) {
      WaterLevelDownloadByStNo({
        st_no: allStation[currentStationIndex][0],
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

  function ShowAllStation(name){   //顯示目前選擇的時序資料
    if(name.name === "水位"){
      console.log("water")
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
      console.log("hello")
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
      console.log("why?")
      return (
        <div></div>
      )
    }
  }


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