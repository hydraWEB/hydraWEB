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
                    if (dt.name === currentFile) {
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
        findAllStation()
    }, [currentFile])

    useEffect(() => {
        if (data !== undefined) {
            DrawChart()
        }
    }, [data])


    useEffect(() => {
        findAllFile()
    }, [allData]);


    function DrawChart() {
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);

        //Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

        // When reading the csv, I must format variables:
        function(d){
            return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
        }).then(

        // Now I can use this dataset:
        function(data) {

            // Add X axis --> it is a date format
            const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
            var xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
            var yAxis = svg.append("g")
            .call(d3.axisLeft(y));

            // Add a clipPath: everything out of this area won't be drawn.
            const clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width )
                .attr("height", height )
                .attr("x", 0)
                .attr("y", 0);

            // Add brushing
            const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

            // Create the line variable: where both the line and the brush take place
            const line = svg.append('g')
            .attr("clip-path", "url(#clip)")

            // Add the line
            line.append("path")
            .datum(data)
            .attr("class", "line")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
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
            function updateChart(event,d) {

            // What are the selected boundaries?
            var extent = event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain([ 4,8])
            }else{
                x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
                line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            line
                .select('.line')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) { return y(d.value) })
                )
            }

            // If user double click, reinitialize the chart
            svg.on("dblclick",function(){
            x.domain(d3.extent(data, function(d) { return d.date; }))
            xAxis.transition().call(d3.axisBottom(x))
            line
                .select('.line')
                .transition()
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
            });

        })
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
                            <h5>選擇座標</h5>
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
                            <br />
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
                            <br />
                            <Button className="mt-2" variant="outlined" type="submit" aria-label="search" onClick={onClick} startIcon={<SearchIcon />}>
                                搜尋
                            </Button>
                        </div>
                    </div>
                    <div className={styles.water_level_layout_left_2}>
                        {list}
                    </div>
                </div>
                <div className={styles.water_level_layout_right}>
                    <div className={styles.water_level_layout_right_1}>
                        <div id="my_dataviz" className={styles.water_level_graph} />
                    </div>
                </div>
            </div>
        </div>
    );
}