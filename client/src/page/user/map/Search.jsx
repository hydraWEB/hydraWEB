
import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import { green } from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { useEffect, useState, useRef } from 'react';
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';

const useStyles1 = makeStyles((theme) => ({
  root: {
    width:"100%",
    borderRadius: 0, 
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#001845',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#001845',
    },
    '&$focused': {
      backgroundColor: '#001845',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
}));




function SearchTextField(props) {
  const classes1 = useStyles1();
  const classes2 = useStyles2();

  return <TextField className={classes1.root} InputProps={{ classes2, disableUnderline: true }} {...props} />;
}


export default function Search(allData, setAllData, layer, setLayer) {
  const { t, i18n } = useTranslation();

  const [text, setText] = useState()

  const sendText = (t) => {
    setText(t.target.value)
  }

  function filter() {
    let resultMeasurement = []
    let allMeasurement = []
    let filteredMeasurement = []
    let alldt = allData.allData
    for (let i = 0; i < alldt.length;i++) {
        let file = alldt[i].files
        for(let dt = 0; dt < file.length;dt++){
          let feat = file[dt]
          for(let f = 0; f< feat.data.features.length; f++){
            allMeasurement.push(feat.data.features[f].properties.measurement)
          }
        }
    }
    filteredMeasurement = [...new Set(allMeasurement)]  //unique
    let isValid = false
    filteredMeasurement.forEach((n,i) => {
      if(n === text) isValid = true
    });
    if(isValid){
      for (let i = 0; i < alldt.length;i++) {
        let file = alldt[i].files
        for(let dt = 0; dt < file.length;dt++){
          let feat = file[dt]
          for(let f = 0; f< feat.data.features.length; f++){
            if(text === feat.data.feautures[f].properties.measurement){
              
            }
            allMeasurement.push(feat.data.features[f].properties.measurement)
          }
        }
      }
    }
    
    return resultMeasurement
  }
  
  function findLayersWithMeasurement(){
    
  }
  return (
    <div>
      <h4 className={styles.func_title}>{t('search')}</h4>
      <div className={styles.search_bar}>
        <SearchTextField
        label="Search"
        defaultValue="Search"
        variant="filled"
        id="Search"
        onChange = {sendText}
      />
      </div>
      <Button 
      variant="contained" 
      color="primary"
      onClick = {filter}
      >
        Primary
      </Button>
    </div>
  )
}