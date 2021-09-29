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

export default function WaterLevel({ allData }) {

    const [data, setData] = useState()
    const [allStation, setAllStation] = useState([])
    const [allFile, setAllFile] = useState([])
    const [currentFile, setCurrentFile] = useState()
    const [currentStation, setCurrentStation] = useState()
    const [currentStationData, setCurrentStationData] = useState(null)
    const { t, i18n } = useTranslation();

    function findCurrentStation() {
        let stationDataArr
        allData.forEach(e => {
            if (e.name === 'ground water well') {
                e.files.forEach(dt => {
                    dt.data.features.forEach(feat => {
                        let st_no = feat.properties.prop1.ST_NO
                        if (typeof feat.properties.prop1.ST_NO === 'number') {
                            st_no = feat.properties.prop1.ST_NO.toString()
                        }
                        if (st_no === currentStation) {
                            stationDataArr = feat
                        }
                    })
                })
            }
        })
        let data = []
        for (let p in stationDataArr.properties) {
            if (p !== 'prop1') {
                let tempArr = {}
                tempArr["date"] = stationDataArr.properties[p].TIME
                tempArr["value"] = stationDataArr.properties[p].Water_Level
                data.push(tempArr)
            }
        }
        setData(data)
        setCurrentStationData(stationDataArr)
    }
    function findAllFile() {
        let fileArr = []
        allData.forEach((e, i) => {
            if (e.name === 'ground water well') {
                e.files.forEach(dt => {
                    fileArr.push(dt.name)
                })
            }
        })
        setAllFile(fileArr)
    }

    function findAllStation() {
        let allStationArr = []
        allData.forEach((e, i) => {
            if (e.name === 'ground water well') {
                e.files.forEach(dt => {
                    if(dt.name === currentFile){
                        dt.data.features.forEach(feat => {
                            if (typeof feat.properties.prop1.ST_NO === "number") {
                                let st_no = feat.properties.prop1.ST_NO.toString()
                                allStationArr.push(st_no)
                            }
                            else {
                                allStationArr.push(feat.properties.prop1.ST_NO)
                            }
                        })
                    }
                })
            }
        })
        setAllStation(allStationArr)
    }

    useEffect(() => {
        if (data !== undefined) {
            drawChart()
        }
    }, [data])


    useEffect(() => {
        findAllFile()
        findAllStation()
    }, [allData]);


    function drawChart() {
        const margin = { top: 30, right: 0, bottom: 30, left: 55 },
            width = 1650 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        const yMinValue = d3.min(data, d => d.value);
        const yMaxValue = d3.max(data, d => d.value);
        const xMinValue = d3.min(data, d => d.date);
        const xMaxValue = d3.max(data, d => d.date);
        console.log(yMinValue)
        console.log(yMaxValue)
        console.log(xMinValue)
        console.log(xMaxValue)

        d3.select("#LineChart").html("");

        var svg = d3.select('#LineChart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.select("#LineChart").selectAll("*").remove();

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, (d) => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([yMinValue, yMaxValue])
            .range([height, 0]);

        const line = d3.line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3.curveMonotoneX);

        const dataset = data.map((d) => ({
            x: new Date(d.date),
            y: d.value
        }));

        svg.append('g')
            .attr('class','x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom().scale(xScale).tickSize(15).tickFormat(d3.timeFormat("%Y-%m-%d:%H-%M-%S")))
            
        
        svg.selectAll('line')

        svg.append('g')
            .attr('class', 'y-axis')
            .attr("fill", 'black')
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .attr("fill", 'black')

        svg.append('path')
            .datum(dataset)
            .attr('fill', "white")
            .attr('stroke', '#f6c3d0')
            .attr('stroke-width', 3)
            .attr('class', 'line')
            .attr('d', line)

        svg.selectAll("text")
            .attr("fill", 'black')
    }

    const onClick = (e) => {
        findCurrentStation()
    }

    const handleChange = (e) => {
        setCurrentStation(e.target.value)
    }

    const handleFileChange = (e) => {
        findAllStation()
        setCurrentFile(e.target.value)
    }

    let selectStation = allStation.map((d) =>
        <option value={d}>{d}</option>
    );

    let selectFile = allFile.map((d) =>
        <option value={d}>{d}</option>
    );

    const list = Object.entries(currentStationData == null ? [] : currentStationData.properties.prop1).map(([key, value]) => {
        return (
            <div>{key} : {value.toString()}</div>
        )
    })
    return (
        <div>
            <h4 className={styles.func_title}>{t('water_level')}</h4>


            <div className={styles.water_level_layout}>
                <div className={styles.water_level_layout_left}>
                    <div className={styles.water_level_layout_left_1}>
                        <div className={styles.water_level_dropdown}>
                            <h3>選擇座標</h3>
                            <Select
                                native
                                value={currentFile}
                                onChange={handleFileChange}
                                inputProps={{
                                    name: 'File',
                                    id: 'age-native-simple2',
                                }}
                            >
                                <option aria-label="None" value="" />
                                {selectFile}
                            </Select>
                            <Select
                                native
                                value={currentStation}
                                onChange={handleChange}
                                inputProps={{
                                    name: 'Station Number',
                                    id: 'age-native-simple',
                                }}
                            >
                                <option aria-label="None" value="" />
                                {selectStation}
                            </Select>
                            <IconButton type="submit" aria-label="search" onClick={onClick}>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.water_level_layout_left_2}>
                       {list}
                    </div>
                </div>
                <div className={styles.water_level_layout_right}>
                    <div className={styles.water_level_layout_right_1}>
                        <div id="LineChart" className={styles.water_level_graph} />
                    </div>
                </div>
            </div>
        </div>
    );
}