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
import { WaterLevelAllStations, WaterLevelGetDataByStNo } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import * as dayjs from 'dayjs'


export default function WaterLevel({STNO}) {

  const [allStation, setAllStation] = useState([])
  const [currentStation, setCurrentStation] = useState(null) //點選後存起來的下拉選單資料
  const [currentStationIndex, setCurrentStationIndex] = useState(null) //水位資料的index
  const [currentStationData, setCurrentStationData] = useState(null) //水位資料
  const [openpop, setOpenpop] = useState(null)
  const [isLoadingStation, setLoadingStation] = useState(true)
  const [isLoadingData, setLoadingData] = useState(false)
  const { t, i18n } = useTranslation();

  const [minHourOptions, setMinHourOptions] = useState([])
  const [minDate, setMinDate] = useState()                      //該站點最小的時間
  const [maxDate, setMaxDate] = useState()                      //該站點最大的時間
  const [minTimeDatePicker, setMinTimeDatePicker] = useState()  //最小時間的value
  const [maxTimeDatePicker, setMaxTimeDatePicker] = useState()  //最大時間的value
  const [minHour, setMinHour] = useState(0)
  const [maxHourOptions, setMaxHourOptions] = useState([])
  const [maxHour, setMaxHour] = useState(0)

  const { addToast } = useToasts();

  function FindIndexOfSTNO(){
    for (let i = 0;i<allStation.length;i++){
      if(allStation[i][0] === STNO){
        let idx = i;
        return idx
      }
    }
    return 0
  }

  let dayjs = require("dayjs")

  useEffect(() => {
    WaterLevelAllStations().then((res) => {
      addToast(t('water_level_loading_success'), { appearance: 'success', autoDismiss: true });
      setAllStation(res.data.data)
    }).catch((err) => {
      addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
      setLoadingStation(false);
    })
  }, [])

  useEffect(() => {
    if(allStation.length > 0){
      FindMinMaxTime(0)
      setCurrentStation(allStation[0][0])
      setCurrentStationIndex(0)
    }
  }, [allStation])

  useEffect(() => {
    if(allStation.length > 0 && STNO !==""){
      let idx = FindIndexOfSTNO()
      FindMinMaxTime(idx)
      setCurrentStation(allStation[idx][0])
      setCurrentStationIndex(idx)
    }
  },[STNO])

  const onSearchClick = (e) => {
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
      DrawEmptyChart()
      setLoadingData(true)
      WaterLevelGetDataByStNo({
        st_no: allStation[currentStationIndex][0],
        start_time:start_datetime,
        end_time:end_datetime, 
      }).then((res) => {
        setCurrentStationData(res.data.data)
      }).catch((err) => {
        addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
      }).finally(() => {
        setLoadingData(false)
      })
    }
    else {
      alert("Minimum time must be smaller than Maximum time")
    }
  }

  useEffect(() => {
    if (currentStationData !== null) {
      DrawChart()
    }
  }, [currentStationData])

  function DrawEmptyChart() {
    d3.select("#LineChart").html("");
    const svg = d3.select("#LineChart")
  }

  const stationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value)
    setCurrentStation(allStation[e.target.value][0])
    setCurrentStationIndex(e.target.value)
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

  function FindMinMaxTime(index) {
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
    dayjs.extend(utc)
    dayjs.extend(timezone)
    let minTime = dayjs(allStation[index][2]).tz("Etc/GMT")
    let maxTime = dayjs(allStation[index][3]).tz("Etc/GMT")
    let minYear = minTime.year();
    let maxYear = maxTime.year();
    let minMonth = minTime.month();
    let maxMonth = maxTime.month();
    let minDay = minTime.date();
    let maxDay = maxTime.date();
    let minHour = minTime.hour();
    let maxHour = maxTime.hour();
    let hourArr = []
    for (let i = 0; i < 24; i++) {
      hourArr.push(i)
    }
    setMinHourOptions(hourArr)
    setMaxHourOptions(hourArr)
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

    const dataset = currentStationData.map((d) => ({
      x: new Date(d[0]),
      y: d[1]
    }));

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr("r", 7.5);

    focus.append("text")
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
      .attr("stroke", "steelblue")
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
        .select('.line')
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
    })
      .on('mouseout', () => {
        focus.style("display", "none");
      })
      .on('mousemove', e => { // mouse moving over canvas

        let length = dataset.length
        let w = 1593.977294921875 - 0.20454709231853485
        let calc = w / length
        var mouse = d3.pointer(e)
        let x_location = Math.floor((mouse[0] + 0.20454709231853485) / calc)
        if (x_location === length) x_location -= 1;
        if (dataset[x_location] !== undefined) {
          focus.attr("transform", "translate(" + x(dataset[x_location]['x']) + "," + y(dataset[x_location]['y']) + ")");
          focus.select("text").text(function () { return dataset[x_location]["y"] });
          if (x_location > (length * 0.95)) {
            focus.select("text")
              .attr("x", -50)
              .attr("y", -20);
          }
          else {
            focus.select("text")
              .attr("x", 0)
              .attr("y", -20);
          }
        }



        //focus.select(".x-hover-line").attr("y2", mouse[0]);
        //focus.select(".y-hover-line").attr("x2", mouse[1]);
      });

    svg.on("dblclick", function () {
      x.domain(d3.extent(dataset, function (d) { return d.x; }))
      xAxis.transition().call(d3.axisBottom().scale(x).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")));
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function (d) { return x(d.x) })
          .y(function (d) { return y(d.y) })
        )
    });

  }


  let selectStation = allStation.map((d, index) =>
    <option value={index}>{`${d[0]} ${d[1]}`}</option>
  );
  let selectMinHour = minHourOptions.map((d) =>
    <option value={d}>{d}</option>
  );
  let selectMaxHour = maxHourOptions.map((d) =>
    <option value={d}>{d}</option>
  );

  const handlePopClick = (event) => {
    setOpenpop(event.currentTarget);
  }
  const handleClose = () => {
    setOpenpop(null);
  };
  const open = Boolean(openpop);
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <h4 className={styles.func_title}>{t('water_level')}</h4>
      {isLoadingStation ?
        <img
          className={styles.loading_image}
          src="/img/loading.svg"
        />
        :
        <div className={styles.water_level_layout}>
          <div className={styles.water_level_layout_left}>
            <div className={styles.function_wrapper_waterlevel}>
              <div className={styles.water_level_dropdown}>
                <h5>{t('select_coordinate')}</h5>

                <div className={styles.wl_left_1}>
                  <h5>{t('select_area')}</h5>
                  <Select
                    native
                    value={currentStationIndex}
                    onChange={stationSelectOnChange}
                  >
                    {selectStation}
                  </Select>
                </div>

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
                  </div>
                </div>


                <Button id="seachClickTrigger" className="mt-2" variant="outlined" type="submit" aria-label="search" onClick={onSearchClick} startIcon={<SearchIcon />}>
                  {t('search')}
                </Button>
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