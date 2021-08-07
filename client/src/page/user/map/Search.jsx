
import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import { green } from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import { GeoJsonLayer } from '@deck.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {zoomIn} from './LayerV2'

const useStyles1 = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: 0,
    '& label.Mui-focused': {
      color: "white",
    },
    '&:focused': {
      color: "white",
      backgroundColor: '#fafafa',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    '& fieldset': {
      borderColor: 'red',
    },
    '&:hover fieldset': {
      borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#001845',
    transition: theme.transitions.create(['border-color', 'box-shadow']),

  },
  focused: {},
}));


const StyledLabel = styled.label(
  props => (
    {
      padding: "8px 10px 0px 10px",
      marginBottom: 0
    }
  )
)


function SearchTextField(props) {
  const classes1 = useStyles1();
  const classes2 = useStyles2();

  return <TextField className={classes1.root} InputProps={{ classes2, disableUnderline: true }} {...props} />;
}


export default function Search({ allData, setAllData, layers, setLayers, zoomTo, setHoverInfo, setClickInfo }) {
  const { t, i18n } = useTranslation();

  const [text, setText] = useState("Changhua_0")
  const [filteredMeasurement, setFilteredMeasurement] = useState()
  const [searchResult, setsearchResult] = useState([])
  const [currentlayer, setCurrentLayer] = useState()
  const [searchResultLayer, setsearchResultLayer] = useState([])
  const [data, setData]= useState()

  const sendText = (t) => {
    setText(t.target.value)
  }

  function filter() {
    let alldt = allData
    let resultMeasurement = []
    let data = []
    let isValid = false
    /* const getDotColor = d => {
      let a = hashCode(d.name)
      return [(a >> 1) & 255, (a << 3) & 255, (a >> 5) & 255]
    }; */

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
              data.push(file[dt])
            }
          }
        }
      }
      
    }
    setData(data)
    /* setsearchResultName(resultName) */
    setsearchResult(resultMeasurement)
  }

  function ShowResult({measurement, data}) {
    function btnClicked(){
      let newLayer = []
      zoomIn(allData, layers, setLayers, setHoverInfo ,setClickInfo, data)
      setLayers(layers)
      console.log("hi")
    }
    
    

    return (
      <StyledLabel>
        <div>
          {measurement}
          {/* &ensp;
          {geometry[0]}
          &ensp;
          {geometry[1]} */}
          <Button onClick ={btnClicked}> 

            Zoom In
          </Button>
        </div>
      </StyledLabel>

    );
  }


  let resultlist = searchResult.map((d) =>
    <ShowResult measurement = {d.measurement} data={d.measurement}/>
  );



  useEffect(() => {
    let allMeasurement = []
    let filteredMeasurement = []
    if (allData.length > 0) {
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
        <div className={styles.search_btn}>
                  <IconButton type="submit" aria-label="search" onClick={filter}>
          <SearchIcon />
        </IconButton>
        </div>

      </div>


      <div>
        {searchResult.length > 0 &&
          <div className={styles.search_result_container}>
            {resultlist}
          </div>
        }
      </div>
    </div>
  )
}