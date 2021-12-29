import React, { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from "react-i18next";
import {
  Button, Form
} from 'react-bootstrap';
import styles from './BackendImage.module.scss';
import { BackendImg } from '../../../lib/api'
import { useToasts } from "react-toast-notifications";



export default function Info() {
  const { t, i18n } = useTranslation();
  const [allImage, setAllImage] = useState([]);
  const { addToast } = useToasts();
  

  useEffect(() => {
    BackendImg().then((res) => {
      addToast(t('image_loading_success'), { appearance: 'success', autoDismiss: true });
      setAllImage(res.data.data)
    }).catch((err) => {
      addToast(t('image_loading_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
    })
  }, [])

  let imagelist = allImage.map((d) => {
    return(
      <div className={styles.all_image}>
        {d !== undefined &&
          <img className={styles.all_image} src={`data:img/png;base64,${d}`} alt = "img" />
        }
      </div>
    )
  });

  return (
    <div>
      <h4 className={styles.func_title}>{t('image')}</h4>
      <div className={styles.function_wrapper_print}>
        {imagelist}
      
      </div>

    </div>

  )

  
}