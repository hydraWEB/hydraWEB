import React, { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from "react-i18next";
import {
  Button, Form
} from 'react-bootstrap';
import styled from "@emotion/styled/macro";
import { saveAs } from 'file-saver';
import styles from './HydraMap.module.scss';


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


export default function Print({ map, deck }) {
  const { t, i18n } = useTranslation();
  const [unit, setUnit] = useState("inch")
  const [format, setForamt] = useState("PNG")

  const onChangeUnit = (e) => {
    setUnit(e.target.value);
  }

  const onChangeFormat = (e) => {
    setForamt(e.target.value);
  }

  //這只能印出點
  const createPrintMap1 = () => {
    const fileName = "Map.png";

    const mapboxCanvas = map.current.getMap().getCanvas(
      document.querySelector(".mapboxgl-canvas")
    );
    deck.current.deck.redraw(true);
    const deckglCanvas = document.getElementById("deckgl-overlay");

    let merge = document.createElement("canvas");
    merge.width = mapboxCanvas.width;
    merge.height = mapboxCanvas.height;

    var context = merge.getContext("2d");

    context.globalAlpha = 1.0;
    context.drawImage(mapboxCanvas, 0, 0);
    context.globalAlpha = 1.0;
    context.drawImage(deckglCanvas, 0, 0);

    merge.toBlob(blob => {
      saveAs(blob, fileName);
    });
  };

  const onBtnClick = () => {
    createPrintMap1()
  }


  return (
    <div>
      <h4 className={styles.func_title}>{t('print')}</h4>
      <Form>
        <FormItem>
          <h5>{t('unit')}</h5>
          <FormItemContainer>
            <Form.Check
              type={'radio'}
              label={t('inch')}
              id={`inch`}
              value={"inch"}
              checked={unit === "inch"}
              onChange={onChangeUnit}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={t('meter')}
              id={`meter`}
              value={"meter"}
              checked={unit === "meter"}
              onChange={onChangeUnit}
            />
          </FormItemContainer>
        </FormItem>

        <FormItem>
          <h5>{t('output_format')}</h5>
          <FormItemContainer>
            <Form.Check
              type={'radio'}
              label={'PNG'}
              id={`PNG`}
              value={"PNG"}
              checked={format === "PNG"}
              onChange={onChangeFormat}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={'PDF'}
              id={`PDF`}
              value={"PDF"}
              checked={format === "PDF"}
              onChange={onChangeFormat}
            />
          </FormItemContainer>
        </FormItem>


        <Button onClick={onBtnClick}>{t('print')}</Button>
      </Form>
    </div>
  )
}