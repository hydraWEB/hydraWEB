import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { GnssFunction, GnssTextBox } from '../../../lib/api'
import React, { useEffect, useState, useRef } from 'react';
import {Form} from 'react-bootstrap';
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
    const [uploadFiles, setUploadFiles] = useState([]);
    const [textBox, setTextBox] = useState('');
    const { addToast } = useToasts();
    const [progress, setProgress] = useState(0);
    const [dataLoadState, setDataLoadState] = useState(0);

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

    const onUploadBtnClick = () => {
      setDataLoadState(1)
      setProgress(0)
      let formData = new FormData();
      for (let i = 0; i< uploadFiles.length; i++){
        formData.append("file", uploadFiles[i])
      }
      axios({
        withCredentials: true,
        method: "post",
        url: 'http://140.121.196.77:30180/api/v1/user/uploadGNSS',
        headers: { 
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${Cookies.get('access')}`
        },
        data: formData,
        onUploadProgress: (p) => {
          setProgress(Math.round(p.loaded * 100 / p.total))
        }
      }).then((res) => {
        addToast(t('Upload_success'), { appearance: 'success', autoDismiss: true });
      }).catch((err) => {
        addToast(t('Upload_fail'), { appearance: 'error', autoDismiss: true });
      }).finally(() => {
      })
    }

    const uploadOnChange = (e) => {
      setProgress(0)
      setDataLoadState(0)
      if(e.target.files.length !== 0){
        let tempArr = []
        for (let i = 0;i<e.target.files.length; i++){
          tempArr.push(e.target.files[i])
        }
        setUploadFiles(tempArr)
      }
    }

    const onButtonClick = () => {
      setLoadingData(true)
      GnssFunction({
        text: textBox
      }).then((res) => {
        setText(fixText(res.data.data))
      }).catch((err) => {
      }).finally(() => {
        setLoadingData(false)
      })
    }

    return (
      <div>
        <h4 className={styles.func_title}>{t('gnss')}</h4>
        <div>
          <form enctype="multipart/form-data" method="POST" action="">
            <input type="file" onChange={uploadOnChange} multiple/>
          </form>
          <Button className="mt-2" type="submit" onClick={onUploadBtnClick}>{t('upload')}</Button>
        </div>
        <div>
          <Form>
            <Form.Group className="mb-1">
              <Form.Control 
                placeholder={t('enter_text')} 
                value={textBox}
                onChange={e => setTextBox(e.target.value)}
              />
            </Form.Group>
          </Form>
        </div>
        <Button type="submit" onClick={onButtonClick}>{t('send_and_execute')}</Button>
        <div className={styles.loading}>
          {dataLoadState === 1 &&
            <LinearProgress variant="determinate" value={progress} />
          }
        </div>
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