import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { GnssFunction } from '../../../lib/api'
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
import Cookies from 'js-cookie' 
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";

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




export default function GNSS(){

    const { t, i18n } = useTranslation();
    const [text, setText] = useState([]);
    const [isLoadingData, setLoadingData] = useState(false);

    function fixText (text) {
      let res = []
      let t = ""
      for (var i = 0; i< text.length;i++){
        if(text[i] === "\n"){
          res.push(t)
          t = ""
        }
        else{
          t = t + text[i]
        }
      }
      console.log(res)
      return res
    }

    let showText = text.map((d) =>
      <p>{d}</p>
    );

    const onButtonClick = () => {
      setLoadingData(true)
      GnssFunction().then((res) => {
        setText(fixText(res.data.data))
      }).catch((err) => {
      }).finally(() => {
        setLoadingData(false)
      })
    }

    return (
        <div>
            <h4 className={styles.func_title}>{t('gnss')}</h4>
            
            <Button className="mt-2" type="submit" onClick={onButtonClick}>{t('execute')}</Button>
            <div className={styles.function_wrapper_print}>
              {isLoadingData &&
                <div className={styles.wl_loading_container}>
                  <img
                    className={styles.loading_image_2}
                    src="/img/loading.svg"
                  />
                  <h5>{t('loading')}...</h5>
                </div>
              }
              {showText}
            </div>
        </div>
    )
} 