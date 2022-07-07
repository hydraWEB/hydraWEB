import React, { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from "react-i18next";
import {
  Button, Form
} from 'react-bootstrap';
import styles from './BackendImage.module.scss';
import { BackendImg } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';


export default function Info() {
  const { t, i18n } = useTranslation();
  const [allImage, setAllImage] = useState([]);
  const { addToast } = useToasts();
  const [img, setImg] = useState([])
  const [showImg, setShowImg] = useState()
  const [preview, setPreview] = useState()
  
  const onUploadClick = (e) => {
    
  }

  useEffect(() => {
    if(img.length === 0) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(img)
    setPreview(objectUrl)
    /*     BackendImg().then((res) => {
      addToast(t('image_loading_success'), { appearance: 'success', autoDismiss: true });
      setAllImage(res.data.data)
    }).catch((err) => {
      addToast(t('image_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
    }) */
  }, [img])

  let imagelist = allImage.map((d) => {
    return(
      <div className={styles.all_image}>
        {d !== undefined &&
          <img className={styles.all_image} src={`data:img/png;base64,${d}`} alt = "img" />
        }
      </div>
    )
  });

  const uploadImageOnChange = (e) => {
    console.log(e)
    console.log(e.target.files[0])
    setImg(e.target.files[0])
  }

  return (
    <div>
      <h4 className={styles.func_title}>{t('image')}</h4>
      <div className={styles.function_wrapper_print}>
        <input type="file" onChange={uploadImageOnChange}/>
        <Button id="seachClickTrigger" className="mt-2" type="submit" aria-label="upload" onClick={onUploadClick} startIcon={<SearchIcon />}>
          {t('upload')}
        </Button>
        {img.length !== 0 &&
          <img className={styles.all_image} src = {preview} alt = "img"/>
        }
      </div>

    </div>

  )

  
}