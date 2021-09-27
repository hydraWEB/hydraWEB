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

export default function WaterLevel({allData}){

    const [allTime, setAllTime] = useState()
    const [allStation, setAllStation] = useState([])
    const [currentStation, setCurrentStation] = useState()
    const [currentStationData, setCurrentStationData] = useState()
    const { t, i18n } = useTranslation();

  


    function findAllStation(target_st){
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

    function findAllTime(){

    }

    useEffect(() => {
        findAllStation()
        drawChart();
      }, [allData]);

      
    

    function drawChart(){

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
            <div className={styles.water_level_layout}>
                <div className={styles.water_level_layout_left}>Left</div>
                <div className={styles.water_level_layout_right}>Right</div>
            </div>
        </div>
    );
}