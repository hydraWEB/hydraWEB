import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DataFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { ColumnLayer } from '@deck.gl/layers';
import { HexagonLayer, HeatmapLayer } from '@deck.gl/aggregation-layers';
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
    backgroundColor: '#457ee7aa',
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
    backgroundColor: '#457ee7aa',
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

export const getDotColor2 = d => {
  if (d) {
    return
  }
}

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
            //data_type: newMapData[i].name,
            visible: true,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data[k]),
            stroked: false,
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

export default function Layer({ allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, setChartIsVisible }) {

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

  const getFilterValue = (d) => {
    const dayjs = require("dayjs")
    let time1 = dayjs(d.properties.time)
    return time1.valueOf()
  }

  function fillcolor2(d) {
    function hslToRgb(h, s, l) {
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let hp = h / 60.0;
      let x = c * (1 - Math.abs((hp % 2) - 1));
      let rgb1;
      if (isNaN(h)) rgb1 = [0, 0, 0];
      else if (hp <= 1) rgb1 = [c, x, 0];
      else if (hp <= 2) rgb1 = [x, c, 0];
      else if (hp <= 3) rgb1 = [0, c, x];
      else if (hp <= 4) rgb1 = [0, x, c];
      else if (hp <= 5) rgb1 = [x, 0, c];
      else if (hp <= 6) rgb1 = [c, 0, x];
      let m = l - c * 0.5;
      return [
        Math.round(255 * (rgb1[0] + m)),
        Math.round(255 * (rgb1[1] + m)),
        Math.round(255 * (rgb1[2] + m))];
    }
    /* console.log(hslToRgb(8,1,0.5)) */
    const maxValue = 47.3;
    const minValue = -45.3;
    const count = 240 / (maxValue - minValue);    //0.38583333    2.591792657
    let calc = Math.ceil((d.properties + 45.3) * count)

    return hslToRgb(calc, 0.9, 0.5)
  }

  // index1:分類的index index:分類中檔案的index
  const OnListItemsChange = (e, index1, data, index) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newMapData = [...allData]
    newMapData[index1].files[index].value = value
    setAllData(newMapData)
    let newLayer = [...layers] //複製一個layer
    newLayer.forEach((element, i) => {
      // 3D資料
      if (element.props.name === data.name && data.name === "GPS") {
        let threeDimensionData = [];
        data.data.features.forEach((dl) => {
          threeDimensionData.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties });
        })
        newLayer[i] = new ScenegraphLayer({
          id: data.name,
          name: data.name,
          data: threeDimensionData,

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
        });
        return;
      }

      // ps資料
      if (element.props.name === "ps_mean_v.xy.json" && data.name === "ps_mean_v.xy.json") { //3d圖層
        setChartIsVisible(value)  //地圖右邊的顏色條
        let psData = []
        data.data.features.forEach((dl) => {
          try {
            psData.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
          } catch (error) {

          }
        })
        //ps檔案
        /*   newLayer[i] =
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
            }) */

        //ps檔案
        /* newLayer[i] =
        new HeatmapLayer({
          id: data.name,
          name: data.name,
          data: hexdata,
          extruded: true,
          pickable: true,
          visible: data.value,
          getWeight: d => d.z,
          getPosition: d => d.COORDINATES,
          
        }) */
        newLayer[i] = new GeoJsonLayer({
          id: data.name,
          name: data.name,
          data: data.data,
          data_type: newMapData[index1].name,
          visible: value,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: fillcolor2,
          stroked: false,
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onHover: onHover,
          onClick: onClick,
          updateTriggers: {
            visible: data.value
          }
        })
        return;
      }

      //普通資料
      if (element.props.name === data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層

        //時序資料
        if (data.time_serie) {
          let measurementMap = new Map();
          data.data.features.forEach((da) => {
            let value = measurementMap.get(da.properties._measurement)
            //value.push(da)
            measurementMap.set(da._measurement, value);
          })
          console.log(measurementMap)
          newLayer[i] = new GeoJsonLayer({
            id: data.name,
            name: data.name,
            data: data.data,
            visible: data.value,
            data_type: newMapData[index1].name,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            stroked: false,
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
            data_type: newMapData[index1].name,
            visible: value,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 5,
            getPointRadius: f => 5,
            getFillColor: getDotColor(data),
            stroked: false,
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
      addToast(t('layer_loading_success'), { appearance: 'success', autoDismiss: true });
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
          if (data.name === "GPS") {
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
              data_type: l.name,
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
          if (data.name === "ps_mean_v.xy.json") {
            let hexdata = []
            data.data.features.forEach((dl) => {
              try {
                hexdata.push({ COORDINATES: [dl.geometry.coordinates[0], dl.geometry.coordinates[1]], z: dl.properties })
              } catch (error) {

              }
            })
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
                getFillColor: fillcolor2,
                stroked: false,
                // Interactive props
                pickable: true,
                autoHighlight: true,
                onHover: onHover,
                onClick: onClick,
                updateTriggers: {
                  visible: data.value
                }
              })
              //ps檔案
              /* new HeatmapLayer({
                id: data.name,
                name: data.name,
                data: hexdata,
                extruded: true,
                pickable: true,
                visible: data.value,
                getWeight: d => d.z,
                getPosition: d => d.COORDINATES,

              }) */
              //ps檔案
              /* new ColumnLayer({
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
              }) */
              //ps檔案
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
                data_type: l.name,
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
      addToast(t('layer_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {

    })
    /* fillcolor2() */
  }, [])


  function initLayer(){

  }

  function getLayer(data) {
    layers.forEach(element => {
      if (element.props.name === data.name) {
        return element
      }
    })
  }

  function setCurrentLayer(data, index1, time, index) {
    let newLayer = [...layers] //複製一個layer
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
          data_type: newMapData[index1].name,
          visible: data.value,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 5,
          getPointRadius: f => 5,
          getFillColor: getDotColor(data),
          stroked: false,
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
    setLayers(newLayer)
  }

  let BtnList = allData.map((d, index1) =>
    <div>
      <Accordion square defaultExpanded>
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