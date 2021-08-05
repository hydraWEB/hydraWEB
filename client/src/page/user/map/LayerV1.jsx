import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DataFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { LayerList } from '../../../lib/api'
import React, { useEffect, useState, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { useTranslation, Trans } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import TooltipMaterial from '@material-ui/core/Tooltip';

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <TooltipMaterial open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </TooltipMaterial>
  );
}


const FlexContainer = styled.div(
  props => (
    {
      display: 'flex',
      marginTop: '20px',
      marginLeft: '0px',
      marginRight: '20px'
    }
  )
)

const FlexWrapper = styled.div(
  props => (
    {
      width: props.flex,
      marginRight: props.marginRight,
    }
  )
)


const InputWrapper = styled.div(
  props => (
    {
      borderRadius: "5px",
      display: 'flex',
      backgroundColor: props.backgroundColor ? "#6465688e" : "#6465688e",
      alignItems: 'flex-start',
      flexFlow: '1',
      paddingTop: '10px',
      paddingBottom: '0px',
      paddingLeft: "5px",
      paddingRight: "5px",
      marginTop: "5px",

    }
  )
)


const StyledInput = styled.input(
  props => (
    {
      alignSelf: "center",
      padding: "50px",
      width: '20px',
      height: '20px',
      flexShrink: '0',
      marginRight: "5px"
    }
  )
)

const StyledLabel = styled.label(
  props => (
    {
      paddingLeft: "10px"
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

const getDotColor = d => {
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


export function CheckItem({ data, currentLayer, setCurrentLayer, onChange, originData }) {

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
      <StyledInput
        type="checkbox"
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
            step={null}
            defaultValue={min}
            marks={timeList}
            onChange={handleChange}
            valueLabelFormat={valueLabelFormat}
            ValueLabelComponent={ValueLabelComponent}
          />
        </>
        }


      </StyledLabel>
    </InputWrapper>
  )
}

export default function Layer({ layers, setLayers, setHoverInfo }) {

  const { t, i18n } = useTranslation();
  const [originData, setOriginData] = useState([]) //原本的不會修改到的data
  const [AllData, setAllData] = useState([]) //地圖顯示Data
  const [currentDataIdx, setCurrentDataIdx] = useState(0) //選擇的json檔分類
  const [currentSelectedData, setCurrentSelectedData] = useState([]) //右邊列表顯示的json檔
  const [dataLoadState, setDataLoadState] = useState(0)
  const [dataLoadStateProgess, setDataLoadProgess] = useState(0)
  const { addToast } = useToasts();

  const onChangeCurrentData = (idx) => {
    setCurrentDataIdx(idx)
    setCurrentSelectedData(AllData[idx].files)
  }

  const onHover = (data) => {
    setHoverInfo(data)
  }

  const getFilterValue = (d) => {
    const dayjs = require("dayjs")
    let time1 = dayjs(d.properties.time)
    return time1.valueOf()
  }


  const OnListItemsChange = (e, data, index) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value //CheckBox打勾是True沒打勾是False
    let newMapData = [...AllData]
    newMapData[currentDataIdx].files[index].value = value
    setAllData(newMapData)
    let newLayer = [...layers] //複製一個layer
    newLayer.forEach((element, i) => {
      if (element.props.name == "ps_mean_v.xy.json") { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        newLayer[i] = new HexagonLayer({
          id: data.name,
          name: data.name,
          data: element.props.data,
          extruded: true,
          pickable: true,
          visible: data.value,
          radius: 1000,
          transitions: {
            elevationScale: 3000
          }
        })
        //return;
      }
      if (element.props.name == data.name) { //如果data和layer的name是一樣的話根據checkbox的值顯示圖層
        if (data.time_serie) {
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
            filterEnabled: false,
            getFilterValue: getFilterValue,
            filterTransformSize: true,
            filterTransformColor: true,
            filterRange: [0, 0],
            // Define extensions
            extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })]
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
        console.log(progressEvent.lengthComputable)
        console.log(percentCompleted);
        setDataLoadProgess(percentCompleted)
      }
    }).then((res) => {
      addToast('圖層載入成功.', { appearance: 'success', autoDismiss: true });
      setDataLoadState(1)
      let list = []
      res.data.data.forEach((element, idx) => {
        console.log(element.name)
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
      setCurrentSelectedData(list[currentDataIdx].files)

      let newLayer = []
      list.forEach((l, index) => {
        l.files.forEach((data, idx) => {
          if (data.name == "ps_mean_v.xy.json") {
            let hexdata = []
            data.data.features.forEach((dl) => {
              try {
                hexdata.push({ "COORDINATES": [dl.geometry.coordinates[0], dl.geometry.coordinates[1]] })
              } catch (error) {

              }
            })
            newLayer.push(
              new HexagonLayer({
                id: data.value,
                name: data.name,
                visible: false,
                data: hexdata,
                elevationScale: 4,
                visible: data.value,
                extruded: true,
                getPosition: d => d.COORDINATES,
                radius: 200,
              })
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

              })
            )
          } else {
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
                onHover: onHover
              }))
          }


        })
      })
      setLayers(newLayer)

    }).catch((err) => {
      setDataLoadState(2)
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

  function setCurrentLayer(data, time, index) {
    //console.log(layers)
    let newLayer = [...layers] //複製一個layer
    let dayjs = require("dayjs")
    let newMapData = [...AllData]
    newMapData[currentDataIdx].files[index].value = true
    newMapData[currentDataIdx].files[index].current_time = time
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
          filterEnabled: true,
          getFilterValue: getFilterValue,
          filterTransformSize: true,
          filterTransformColor: true,
          filterRange: [time, time],
          onFilteredItemsChange: onFilteredItemsChange,
          // Define extensions
          extensions: [new DataFilterExtension({ filterSize: 1, countItems: true })]
        })
      }
    })
    //console.log(time)
    setLayers(newLayer)
  }

  let CurrentListItems = currentSelectedData.map((data, index) =>
    <CheckItem currentLayer={getLayer(data)} setCurrentLayer={(time) => setCurrentLayer(data, time, index)} originData={originData} data={AllData[currentDataIdx].files[index]} onChange={(e) => OnListItemsChange(e, data, index)} />
  );

  let BtnList = AllData.map((data, index) =>
    <NormalButton className={styles.btn_list} isLightOn={currentDataIdx === data.id} text={data.name} onClick={(e) => onChangeCurrentData(index)} />
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
          <FlexContainer>
            <FlexWrapper flex={"30%"} marginRight={"20px"}>
              {BtnList}
            </FlexWrapper>
            <FlexWrapper flex={"70%"}>
              {CurrentListItems}
            </FlexWrapper>
          </FlexContainer>
        </div>
      }
    </div>
  )


}