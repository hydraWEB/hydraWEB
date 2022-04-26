import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { UploadFile } from '../../../lib/api'
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
import SearchIcon from '@material-ui/icons/Search';

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


export default function UploadFIle() {

  const { t, i18n } = useTranslation();
  const [fileType, setFileType] = useState()
  const { addToast } = useToasts();
  const [uploadFile, setUploadFile] = useState()
	const [isShow, setIsShow] = useState(false)

  const uploadOnChange = (e) => {
    if(e.target.files.length !== 0){
      let tempArr = []
      for (let i = 0;i<e.target.files.length; i++){
        tempArr.push(e.target.files[i])
      }
      setUploadFile(tempArr)
      let ft = e.target.files[0].name
      if(ft.endsWith('.json')){
        setFileType("json")
      }
      else if(ft.endsWith('.csv')){
        setFileType("csv")
      }
      else if(ft.endsWith('.shp')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.shx')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.dbf')){
        setFileType("shapefile")
      }
      else{
        setFileType("unknow")
      }
    }
  }

  const onFileUploadClick = (value) => {
    let formData = new FormData();
    for (let i = 0; i< uploadFile.length; i++){
      formData.append("file", uploadFile[i])
    }
    //formData.append("file",uploadFile);
    var htmllink = ""
    if(value === 'original'){
      htmllink = 'http://127.0.0.1:8000/api/v1/user/uploadFile/original'
    }
    else if (value === 'json'){
      htmllink = 'http://127.0.0.1:8000/api/v1/user/uploadFile/convertJSON'
    }
    else if (value === 'csv'){
      htmllink = 'http://127.0.0.1:8000/api/v1/user/uploadFile/convertCSV'
    }
    else if (value === 'shp'){
      htmllink = 'http://127.0.0.1:8000/api/v1/user/uploadFile/convertSHP'
    }
    fetch(htmllink, {
      method: 'POST',
      headers: {
        "Content-Disposition" : `attachment; filename=${uploadFile[0].name}`,
      },
      body: formData,
    }).then((res) => {
      console.log(res.data)
      addToast(t('Upload_success'), { appearance: 'success', autoDismiss: true });
    }).catch((err) => {
      console.log(err)
      addToast(t('Upload_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
    })
  }

	function ShowButton(){
		if(fileType === "json"){
			return (
				<div className={styles.function_wrapper_upload}>
					<Button className="mt-2" type="submit" onClick={() => onFileUploadClick("original")}>
         		{t('upload')}
					</Button>
					<Button className="mt-2" type="submit" onClick={() => onFileUploadClick("csv")}>
         		{t('convert_to_csv_and_upload')}
					</Button>
				</div>
			)
		}
		else if(fileType === "csv"){
			return (
				<div className={styles.function_wrapper_upload}>
					<Button type="submit" onClick={() => onFileUploadClick("original")}>
         		{t('upload')}
					</Button>
					<Button className="mt-2" type="submit" onClick={() => onFileUploadClick("json")}>
         		{t('convert_to_json_and_upload')}
					</Button>
					<Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
         		{t('convert_to_geojson_and_upload')}
					</Button>
				</div>
			)
		}
		else if(fileType === "shapefile"){
			return (
				<div className={styles.function_wrapper_upload}>
					<Button type="submit" onClick={() => onFileUploadClick("original")}>
         		{t('upload')}
					</Button>
				
					<Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
         		{t('convert_to_geojson_and_upload')}
					</Button>
				</div>
			)
		}
		else{
			return (
				<div></div>
			)
		}
	}



  return (
    <div>
      <h4 className={styles.func_title}>{t('Upload_file')}</h4>
      <form enctype="multipart/form-data" method="POST" action="">
        <input type="file" onChange={uploadOnChange} multiple/>
      </form>
			<div>
				<ShowButton/>
			</div>
    </div>
  )


}