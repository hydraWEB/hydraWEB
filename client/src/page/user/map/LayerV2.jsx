import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DataFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { ColumnLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { LayerList } from '../../../lib/api'
import React, { useEffect, useState, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { useTranslation, Trans } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import TooltipMaterial from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const Accordion = withStyles({
  root: {
    backgroundColor: '#024FA1',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#024FA1',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 20,
    '&$expanded': {
      minHeight: 20,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: 0,
  },
}))(MuiAccordionDetails);


function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <TooltipMaterial open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </TooltipMaterial>
  );
}

const InputWrapper = styled.div(
  props => (
    {
      width: "100%",
      borderWidth: "2x",
      borderColor: "white",
      borderBottom: "1px",
      borderBottomStyle: "solid",
      borderRadius: "0px",
      display: 'flex',
      backgroundColor: props.backgroundColor ? "#6465688e" : "#6465688e",
      alignItems: 'flex-start',
      flexFlow: '1',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: "0px",
      paddingRight: "5px",

    }
  )
)


const StyledLabel = styled.label(
  props => (
    {
      padding: "8px 10px 0px 10px",
      marginBottom: 0
    }
  )
)


const hashCode = (str) => { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export const getDotColor = d => {
  let a = hashCode(d.name)
  return [(a >> 1) & 255, (a << 3) & 255, (a >> 5) & 255]
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(value) {
  return "#" + componentToHex(value[0]) + componentToHex(value[1]) + componentToHex(value[2]);
}

const checkBoxStyle = makeStyles({
  root: (props) => ({
    color: props.color,
    "&checked": {
      color: props.color
    }
  })
});



function CustomCheckBox({ color, checked, onChange }) {
  const classes1 = checkBoxStyle({ color: color });
  return (
    <Checkbox
      className={classes1.root}
      checked={checked}
      onChange={onChange}
      color="default"
    />
  )
}


function CheckItem({ data, currentLayer, setCurrentLayer, onChange, originData }) {

  const [timeList, setTimeList] = useState([])
  const [min, setmin] = useState(0)
  const [max, setmax] = useState(0)
  const [currentSliderValue, setCurrentSliderValue] = useState(0)

  function findminmax(arr) {
    setmin(arr[0].value)
    setmax(arr[arr.length - 1].value)
  }

  useEffect(() => {
    let dayjs = require("dayjs")
    let newTimeList = []
    if (data.time_serie) {
      data.data.features.forEach((element) => {
        newTimeList.push(element.properties.time)
      })
      newTimeList = newTimeList.sort()
      let uniq = []
      let unique = [...new Set(newTimeList)];
      unique.forEach((element) => {
        let time = dayjs(element)
        uniq.push({
          value: time.valueOf()
        })
      })
      setTimeList(uniq)
      findminmax(uniq)
      setCurrentSliderValue(data.current_time)
    }
  }, [data])

  function valueLabelFormat(value) {
    let dayjs = require("dayjs")
    return dayjs(value).format('YYYY/MM/DD')
  }


  const handleChange = (event, newValue) => {
    setCurrentSliderValue(newValue)
    setCurrentLayer(newValue)
  };

  return (
    <InputWrapper backgroundColor={rgbToHex(getDotColor(data))}>
      <CustomCheckBox
        color={rgbToHex(getDotColor(data))}
        checked={data.value}
        onChange={onChange}
      />
      <StyledLabel>
        <div>
          {data.name}
        </div>
        {data.time_serie && <>
          <Slider
            value={currentSliderValue}
            min={min}
            max={max}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            color="secondary"
            step={null}
            defaultValue={min}
            marks={timeList}
            onChange={handleChange}
            valueLabelFormat={valueLabelFormat}
            ValueLabelComponent={ValueLabelComponent}
          />
        </>
        }
        <div className={styles.info_btn}>
        </div>

      </StyledLabel>
    </InputWrapper>
  )
}

export function zoomIn(allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, geometry, data) {
  const onClick = (data) => {
    console.log(data)
    setClickInfo(data)
  }
  const onHover = (data) => {
    setHoverInfo(data)
  }
  let newMapData = [...allData]
  for (let i = 0; i < newMapData.length; i++) {
    for (let j = 0; j < newMapData[i].files.length; j++) {
      for (let k = 0; k < data.length; k++) {
        if (newMapData[i].files[j].name === data[k].name) {
          newMapData[i].files[j].value = true
        }
      }
    }

  }
  setAllData(newMapData)
  let newLayer = []
  if (layers.length > 0) {
    newLayer = [...layers]
    layers.forEach((element, i) => {
      for (let k = 0; k < data.length; k++) {
        if (element.props.id === data[k].name) {
          newLayer[i] = new GeoJsonLayer({
            id: data[k].name,
            name: data[k].name,
            data: data[k].data,
            visible: true,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data[k]),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            updateTriggers: {
              visible: data.value
            }
          })
        }
      }

    })
  }



  setLayers(newLayer)



}

export default function Layer({ allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo }) {

  const { t, i18n } = useTranslation();
  const [originData, setOriginData] = useState([]) //原本的不會修改到的data
  const [dataLoadState, setDataLoadState] = useState(0)
  const [dataLoadStateProgess, setDataLoadProgess] = useState(0)
  const { addToast } = useToasts();

  const onHover = (data) => {
    setHoverInfo(data)
  }

  const onClick = (data) => {
    console.log(data)
    setClickInfo(data)
  }

  const detectIfGeology = (data) => {
    
  }


  const getFilterValue = (d) => {
    const dayjs = require("dayjs")
    let time1 = dayjs(d.properties.time)
    return time1.valueOf()
  }

  function fillcolor(d) {
    if (d.z > 34) {
      return [146, 0, 29]
    } else if (d.z > 30) {
      return [182, 21, 19, 255]
    } else if (d.z > 25) {
      return [168, 72, 5, 255]
    } else if (d.z > 20) {
      return [158, 91, 5, 255]
    } else if (d.z > 15) {
      return [135, 96, 3, 255]
    } else if (d.z > 10) {
      return [98, 97, 0, 255]
    } else if (d.z > 5) {
      return [83, 82, 0, 255]
    } else if (d.z > 0) {
      return [54, 85, 24, 255]
    }
    else {
      return [54, 138, 155, 255]
    }

  }

  // index1:分類的index index:分類中檔案的index
  const OnListItemsChange = (e, index1, data, index) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newMapData = [...allData]
    newMapData[index1].files[index].value = value
    setAllData(newMapData)
    let newLayer = [...layers] //複製一個layer
    newLayer.forEach((element, i) => {
      if (element.props.name === "3d_test.json" && data.name === "3d_test.json" || element.props.name === "3d_test2.json" && data.name === "3d_test2.json" ) {
        let hexdata = []
        data.data.features.forEach((dl) => {
          try {
            hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
          } catch (error) {

          }
        })
        newLayer[i] = new ScenegraphLayer({
          id: data.name,
          name: data.name,
          data: hexdata,
          
          pickable: true,
          visible: data.value,
          scenegraph: 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
          getPosition: d => d.COORDINATES,
          getOrientation: d => [0, Math.random() * 180, 90],
          _animations: {
            '*': { speed: 5 }
          },
          sizeScale: 500,
          _lighting: 'pbr'
        })
        return
      }
      if (element.props.name == "ps_mean_v.xy.json" && data.name === "ps_mean_v.xy.json") { //3d圖層
        let hexdata = []
        data.data.features.forEach((dl) => {
          try {
            hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
          } catch (error) {

          }
        })
        newLayer[i] =
          new ColumnLayer({
            id: data.name,
            name: data.name,
            data: hexdata,
            extruded: true,
            pickable: true,
            visible: data.value,
            radius: 500,
            coverage: 0.7,
            getElevation: d => d.z + 45.3,
            elevationScale: 500,
            getPosition: d => d.COORDINATES,
            getFillColor: fillcolor,
            getLineColor: [0, 0, 0],
          })
        return;
      }
      if (element.props.name == data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        if (data.time_serie) {
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: data.value,
            data_type:newMapData[index1].name,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            filterEnabled: false,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,
            filterRange: [0, 0],
            // Define extensions
            extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
            onClick: onClick,
            updateTriggers: {
              visible: data.value,
              getFilterValue: getFilterValue,
            }

          })
        } else {
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onHover: onHover,
            onClick: onClick,
            updateTriggers: {
              visible: data.value
            }
          })
        }

      }
    });
    setLayers(newLayer) //修改本來地圖的layer */ 
  }


  useEffect(() => {
    LayerList({
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        setDataLoadProgess(percentCompleted)
      }
    }).then((res) => {
      addToast('圖層載入成功.', { appearance: 'success', autoDismiss: true });
      setDataLoadState(1)
      let list = []
      res.data.data.forEach((element, idx) => {
        let files = element.file
        files.forEach((element2, idx) => {
          files[idx].value = false //不會先顯示圖層
          files[idx].current_time = 0 //不會先顯示圖層
        })

        list.push({
          "id": idx,
          "name": element.name,
          "files": files,
        })
      })
      setAllData(list)
      setOriginData(list)

      let newLayer = [...layers]
      list.forEach((l, index) => {
        l.files.forEach((data, idx) => {
          if (data.name == "3d_test.json" || data.name === "3d_test2.json") {
            let hexdata = []
            data.data.features.forEach((dl) => {
              try {
                hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
              } catch (error) {

              }
            })
            newLayer.push(new ScenegraphLayer({
              id: data.name,
              name: data.name,
              data: hexdata,
              pickable: true,
              visible: false,
              data_type:l.name,
              scenegraph: 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
              getPosition: d => d.COORDINATES,
              getOrientation: d => [0, Math.random() * 180, 90],
              _animations: {
                '*': { speed: 5 }
              },
              sizeScale: 500,
              _lighting: 'pbr'
            }))
            return
          }
          if (data.name == "ps_mean_v.xy.json") {
            let hexdata = []
            data.data.features.forEach((dl) => {
              try {
                hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
              } catch (error) {

              }
            })
            newLayer.push(
              new ColumnLayer({
                id: data.name,
                name: data.name,
                data: hexdata,
                extruded: true,
                pickable: true,
                visible: data.value,
                radius: 500,
                coverage: 0.7,
                getElevation: d => d.z,
                elevationScale: 500,
                getPosition: d => d.COORDINATES,
                getFillColor: fillcolor,
                getLineColor: [0, 0, 0],
              })
              /* new HexagonLayer({
                id: data.name,
                name: data.name,
                visible: false,
                data: hexdata,
                elevationScale: 4,
                visible: data.value,
                extruded: true,
                getPosition: d => d.COORDINATES,
                getElevation: d => d.z,
                radius: 200,
                coverage: 0.7
              }) */
            )
            return
          }
          if (data.time_serie) {
            newLayer.push(
              new GeoJsonLayer({
                id: data.name,
                name: data.name,
                data: data.data,
                visible: data.value,
                // Styles
                filled: true,
                pointRadiusMinPixels: 2,
                pointRadiusScale: 5,
                getPointRadius: f => 5,
                getFillColor: getDotColor(data),
                // Interactive props
                pickable: true,
                autoHighlight: true,
                onHover: onHover,
                filterEnabled: false,
                getFilterValue: getFilterValue,
                filterTransformSize: true,
                filterTransformColor: true,
                filterRange: [0, 0],
                // Define extensions
                extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
                onClick: onClick,
                updateTriggers: {
                  getFilterValue: getFilterValue,
                  visible: data.value,
                }
              })
            )
          } else {
            newLayer.push(
              new GeoJsonLayer({
                id: data.name,
                name: data.name,
                data: data.data,
                visible: data.value,
                data_type:l.name,
                // Styles
                filled: true,
                pointRadiusMinPixels: 2,
                pointRadiusScale: 5,
                getPointRadius: f => 5,
                getFillColor: getDotColor(data),
                // Interactive props
                pickable: true,
                autoHighlight: true,
                onHover: onHover,
                onClick: onClick,
                updateTriggers: {
                  visible: data.value,
                }
              }))
          }


        })
      })
      setLayers(newLayer)

    }).catch((err) => {
      setDataLoadState(2)
      addToast('圖層載入失敗.', { appearance: 'error', autoDismiss: true });
    }).finally(() => {

    })
  }, [])

  function getLayer(data) {
    layers.forEach(element => {
      if (element.props.name === data.name) {
        return element
      }
    })
  }

  function setCurrentLayer(data, index1, time, index) {
    //console.log(layers)
    let newLayer = [...layers] //複製一個layer
    let dayjs = require("dayjs")
    let newMapData = [...allData]
    newMapData[index1].files[index].value = true
    newMapData[index1].files[index].current_time = time
    setAllData(newMapData)

    function onFilteredItemsChange(id, count) {
      console.log(count)
    }

    newLayer.forEach((element, i) => {
      if (element.props.name === data.name) {
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          visible: data.value,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: getDotColor(data),
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          onClick: onClick,
          filterEnabled: true,
          getFilterValue: getFilterValue,
          filterTransformSize: true,
          filterTransformColor: true,
          filterRange: [time, time],
          onFilteredItemsChange: onFilteredItemsChange,
          // Define extensions
          extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })],
          updateTriggers: {
            filterRange: [time, time],
            onFilteredItemsChange: onFilteredItemsChange,
            getFilterValue: getFilterValue,
            visible: data.value,
          }
        })
      }
    })
    //console.log(time)
    setLayers(newLayer)
  }

  let BtnList = allData.map((d, index1) =>
    <div>
      <Accordion square >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>{d.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.flex_column}>
            {
              d.files.map((data, index) =>
                <CheckItem currentLayer={getLayer(data)} setCurrentLayer={(time) => setCurrentLayer(data, index1, time, index)} originData={originData} data={data} onChange={(e) => OnListItemsChange(e, index1, data, index)} />
              )
            }
          </div>

        </AccordionDetails>
      </Accordion>
    </div>
  );

  return (
    <div>
      <h4 className={styles.func_title}>{t('layer')}</h4>
      {
        dataLoadState == 0 &&
        <div className={styles.loading}>
          <LinearProgress variant="determinate" value={dataLoadStateProgess} />
        </div>
      }
      {
        dataLoadState == 1 &&
        <div >
          {BtnList}
        </div>
      }
    </div>
  )


}