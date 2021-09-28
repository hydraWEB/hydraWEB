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

export default function WaterLevel({allData}){

    const [data, setData] = useState()
    const [allStation, setAllStation] = useState([])
    const [currentStation, setCurrentStation] = useState()
    const [currentStationData, setCurrentStationData] = useState()
    const { t, i18n } = useTranslation();

  
    function findCurrentStation(){
        let stationDataArr
        allData.forEach(e => {
            if(e.name === 'ground water well'){
                e.files.forEach(dt => {
                    dt.data.features.forEach(feat => {
                        let st_no = feat.properties.prop1.ST_NO
                        if(typeof feat.properties.prop1.ST_NO === 'number'){
                            st_no = feat.properties.prop1.ST_NO.toString()
                        }
                        if(st_no === currentStation){
                            stationDataArr = feat
                        }
                    })
                })
            }
        })
        let data = []
        for (let p in stationDataArr.properties){
            if (p !== 'prop1'){
                let tempArr = {}
                tempArr["date"] = stationDataArr.properties[p].TIME
                tempArr["value"] = stationDataArr.properties[p].Water_Level
                data.push(tempArr)
            }
        }
        setData(data)
        setCurrentStationData(stationDataArr)
    }

    function findAllStation(){
        let allStationArr = []
        allData.forEach((e, i) => {
            if (e.name === 'ground water well'){
                e.files.forEach(dt => {
                    dt.data.features.forEach(feat => {
                        if (typeof feat.properties.prop1.ST_NO === "number"){
                            let st_no = feat.properties.prop1.ST_NO.toString()
                            allStationArr.push(st_no)
                        }
                        else{
                            allStationArr.push(feat.properties.prop1.ST_NO)
                        }
                    })
                })
            }
        })
        setAllStation(allStationArr)
    }

    useEffect(() => {
        if(data !== undefined){
            drawChart()
        }
    }, [data])


    useEffect(() => {
        findAllStation()
      }, [allData]);

    function findAllTime(){
        let timeArr = []
        currentStationData.forEach(dt => {

        })
    }   


    function drawChart(){   
        const margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = 500 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
        const yMinValue = d3.min(data, d=> d.value);
        const yMaxValue = d3.max(data, d=> d.value);
        const xMinValue = d3.min(data, d=> d.date);
        const xMaxValue = d3.max(data, d=> d.date);
        
        const svg = d3.select('#LineChart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, (d) => new Date(d.date)))
            .range([0,width]);

        const yScale = d3.scaleLinear()
            .domain([0, yMaxValue])
            .range([height, 0]);

        const line = d3.line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        const dataset = data.map((d) => ({
            x: new Date(d.date),
            y: d.value
        }));


        svg.append('path')
            .datum(dataset)
            .attr('fill',"white")
            .attr('stroke', '#f6c3d0')
            .attr('stroke-width', 10)
            .attr('class', 'line')
            .attr('d', line)
    }

    const onClick = (e) => {
        findCurrentStation()
    }

    const handleChange = (e) =>{
        setCurrentStation(e.target.value)
        
    }

    let selectStation = allStation.map((d)=>
    <option value={d}>{d}</option>
    );


    return (
        <div>
            <h4 className={styles.func_title}>{t('water_level')}</h4>
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
            <div className={styles.water_level_layout}>
                <div className={styles.water_level_layout_left}>Left</div>
                <div className={styles.water_level_layout_right}>Right</div>
            </div>
            <div id="LineChart"/>
        </div>
    );
}