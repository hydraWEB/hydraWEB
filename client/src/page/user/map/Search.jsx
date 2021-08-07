
import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import { green } from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { GeoJsonLayer } from '@deck.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';

const useStyles1 = makeStyles((theme) => ({
  root: {
    width: "100%",
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


export default function Search({allData, setAllData, layers, setLayer, zoomTo}) {
  const { t, i18n } = useTranslation();

  const [text, setText] = useState("Changhua_0")
  const [filteredMeasurement, setFilteredMeasurement] = useState()
  const [searchResult, setsearchResult] = useState([])

  const sendText = (t) => {
    setText(t.target.value)
  }
  function filter() {
    let alldt = allData
    let resultMeasurement = []
    let isValid = false
    filteredMeasurement.forEach((n, i) => {
      if (n === text) isValid = true
    });
    if (isValid) {
      for (let i = 0; i < alldt.length; i++) {
        let file = alldt[i].files
        for (let dt = 0; dt < file.length; dt++) {
          let feat = file[dt]
          for (let f = 0; f < feat.data.features.length; f++) {
            if (text === feat.data.features[f].properties.measurement) {
              resultMeasurement.push(feat.data.features[f])
            }
          }
        }
      }
    }
    setsearchResult(resultMeasurement)
  }

  function ShowResult({ data, geometry }) {
    
    const StyledLabel = styled.label(
      props => (
        {
          padding: "8px 10px 0px 10px",
          marginBottom:0
        }
      )
    )

    const ZoomIn = (data) => {
      zoomTo(geometry)
    }
    
    return (
      <StyledLabel>
        <div>
          {data.measurement}
          <Button
          onClick = {ZoomIn}>
            Zoom In
          </Button>
        </div>
      </StyledLabel>
      
    );
  }


  let resultlist = searchResult.map((d) =>
    <ShowResult data={d.properties} geometry={d.geometry.coordinates} />
  );



  useEffect(() => {
    let allMeasurement = []
    let filteredMeasurement = []
    if(allData.length > 0) {
      let alldt = [...allData]
      for (let i = 0; i < alldt.length; i++) {
        let file = alldt[i].files
        for (let dt = 0; dt < file.length; dt++) {
          let feat = file[dt]
          for (let f = 0; f < feat.data.features.length; f++) {
            allMeasurement.push(feat.data.features[f].properties.measurement)
          }
        }
      }
      filteredMeasurement = [...new Set(allMeasurement)]  //unique
    }
    
    setFilteredMeasurement(filteredMeasurement)

  }, [allData])
  return (
    <div>
      <h4 className={styles.func_title}>{t('search')}</h4>
      <div className={styles.search_bar}>
        <SearchTextField
          label="Search"
          defaultValue="Changhua_0"
          variant="filled"
          id="Search"
          onChange={sendText}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={filter}
      >
        Search
      </Button>
      <div>
        {searchResult.length > 0 &&
          <div>        
            {resultlist}
          </div>
        }
      </div>
    </div>
  )
}