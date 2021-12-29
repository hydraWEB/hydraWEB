import React, { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from "react-i18next";
import {
  Button, Form
} from 'react-bootstrap';
import styled from "@emotion/styled/macro";
import { saveAs } from 'file-saver';
import styles from './HydraMap.module.scss';
import { jsPDF } from "jspdf";

const FormItem = styled.div(
  props => ({
    padding: "10px 10px 10px 0px",
  })
)

const FormItemContainer = styled.div(
  props => ({
    display: "flex",
    flexDirection: "row"
  })
)


export default function MapStyle({ SetMapStyle }) {
  const { t, i18n } = useTranslation();
  const [format, setForamt] = useState(`Monochrome`)



  const onChangeStyle = (e) => {
    setForamt(e.target.value);
    SetMapStyle(e.target.value)
  }



 

  return (
      <div>
      <h4 className={styles.func_title}>{t('map_style')}</h4>
      <div className={styles.function_wrapper_print}>
      <Form>
        <FormItem >
          <h5>{t('select_map_style')}</h5>
          <FormItemContainer>
            <Form.Check 
              type={'radio'}
              label={'Monochrome'}
              id={`Monochrome`}
              value={`Monochrome`}
              checked={format === `Monochrome`}
              onChange={onChangeStyle}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={'Streets'}
              id={`Streets`}
              value={`Streets`}
              checked={format === `Streets`}
              onChange={onChangeStyle}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={'Basic'}
              id={`Basic`}
              value={`Basic`}
              checked={format === `Basic`}
              onChange={onChangeStyle}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={'Satellite'}
              id={`Satellite`}
              value={`Satellite`}
              checked={format === `Satellite`}
              onChange={onChangeStyle}
            />
          </FormItemContainer>
        </FormItem>


      </Form>
      </div>

    </div>

  )
}