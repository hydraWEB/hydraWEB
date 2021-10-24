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

export default function WaterLevelV2({ }) {

  const [allStation, setAllStation] = useState([])
  const [currentStation, setCurrentStation] = useState(null)
  const [currentStationData, setCurrentStationData] = useState(null)
  const [openpop, setOpenpop] = useState(null)
  const [isLoadingStation, setLoadingStation] = useState(true)
  const [isLoadingData, setLoadingData] = useState(false)
  const { t, i18n } = useTranslation();

  const [minTimeOptions, setMinTimeOptions] = useState({
    "year": [],
    "month": [],
    "day": [],
    "hour": [],

  })
  
  const [minTimeDatePicker, setMinTimeDatePicker] = useState()
  const [minTime, setMinTime] = useState({
    "year": 2000,
    "month": 12,
    "day": 11,
    "hour": 13,
  })

  const [maxTimeOptions, setMaxTimeOptions] = useState({
    "year": [],
    "month": [],
    "day": [],
    "hour": [],
  })

  const [maxTime, setMaxTime] = useState({
    "year": 0,
    "month": 0,
    "day": 0,
    "hour": 0,
  })



  const { addToast } = useToasts();
  
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

  const onSearchClick = (e) => {

    DrawEmptyChart()
    setLoadingData(true)
    WaterLevelGetDataByStNo({
      st_no: currentStation[0]
    }).then((res) => {
      setCurrentStationData(res.data.data)
    }).catch((err) => {
      addToast(t('water_level_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
      setLoadingData(false)
    })
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

  function FindMinMaxTime(target) {
    console.log(target)
    
    let minTime = dayjs(target[2])
    let maxTime = dayjs(target[3])

    let minYear = minTime.year();
    let maxYear = maxTime.year();
    let minMonth = minTime.month();
    let maxMonth = maxTime.month();
    let minDay = minTime.day();
    let maxDay = maxTime.day();
    let minHour = minTime.hour();
    let maxHour = maxTime.hour();

    for (let i = minYear; i <= maxYear; i++) {
      minTimeOptions['year'].push(i);
      maxTimeOptions['year'].push(i);
    }
    for (let i = minMonth; i <= 12; i++) {
      minTimeOptions['month'].push(i);
    }
    for (let i = 1; i <= maxMonth; i++) {
      maxTimeOptions['month'].push(i);
    }

    for (let i = minDay; i <= 31; i++) {
      minTimeOptions['day'].push(i);
    }
    for (let i = 1; i <= maxDay; i++) {
      maxTimeOptions['day'].push(i);
    }

    for (let i = minHour; i < 24; i++) {
      minTimeOptions['hour'].push(i);
    }
    for (let i = 0; i <= maxHour; i++) {
      maxTimeOptions['hour'].push(i);
    }
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


  const stationSelectOnChange = (e) => {
    console.log(e.target.value)
    FindMinMaxTime(e.target.value)
    setCurrentStation(e.target.value)
  }

  let selectStation = allStation.map((d) =>
    <option value={d}>{`${d[0]} ${d[1]}`}</option>
  );
  let selectMinHour = minTimeOptions['hour'].map((d) =>
    <option value={d}>d</option>
  );

  /* const list = Object.entries(currentStationData == null ? [] : currentStationData.properties.prop1).map(([key, value]) => {
    return (
      <div>{key} : {value.toString()}</div>
    )
  }) */
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
            <div className={styles.water_level_layout_left_1}>
              <div className={styles.water_level_dropdown}>
                <h5>{t('select_coordinate')}</h5>
                <Select
                  native
                  value={currentStation}
                  onChange={stationSelectOnChange}
                  inputProps={{
                    name: 'Station Number',
                    id: 'age-native-simple',
                  }}
                >
                  <option aria-label="None" value="" />
                  {selectStation}
                </Select>
                <br />
                <h5>選擇最小時間</h5>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Basic example"
                    value={minTimeDatePicker}
                    minDate={dayjs('2021-01-01T00:00:00Z',"MM/DD/YYYY")}
                    maxDate={dayjs('2021-08-31T15:00:00Z',"MM/DD/YYYY")}
                    onChange={(newValue) => {
                      
                      setMinTimeDatePicker(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <h5>選擇最大時間</h5>
                <p>年</p>
                <Select
                  value={maxTime}
                >
                  {maxTimeOptions['year'].map((d) =>
                    <option value={d[3]}>{`${d[3]}`}</option>
                  )}
                </Select>
                <p>月</p>
                <Select
                  value={maxTime}
                >
                  { }
                </Select>
                <p>日</p>
                <Select
                  value={maxTime}
                >
                  { }
                </Select>
                <p>小時</p>
                <Select
                  value={maxTime['hour']}
                >
                  {selectMinHour}
                </Select>

                <Button className="mt-2" variant="outlined" type="submit" aria-label="search" onClick={onSearchClick} startIcon={<SearchIcon />}>
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
            <div className={styles.water_level_layout_left_2}>
              {/* {list} */}
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
}