
import styles from './HydraMap.module.scss';
import { useTranslation, Trans } from "react-i18next";
import Button from '@material-ui/core/Button';

import {
  EditableGeoJsonLayer,
  ViewMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode
} from "nebula.gl";

export default function Measurement({ mode, setMode }) {
  const { t, i18n } = useTranslation();

  function setMeasureDistanceMode() {
    if (mode === MeasureDistanceMode) {
      setMode(ViewMode)
    } else {
      setMode(MeasureDistanceMode)
    }
  }

  function setMeasureAreaMode() {
    if (mode === MeasureAreaMode) {
      setMode(ViewMode)
    } else {
      setMode(MeasureAreaMode)
    }
  }

  function setMeasureAngleMode() {
    if (mode === MeasureAngleMode) {
      setMode(ViewMode)
    } else {
      setMode(MeasureAngleMode)
    }
  }

  return (<div>
    <h4 className={styles.func_title}>{t('measurement')}</h4>
    <div className={styles.function_wrapper_measurement}>
      <h5>{t('distance')}</h5>
      <div className={styles.circle_analysis_btn}>
        <Button
          onClick={(e) => setMeasureDistanceMode()}
          variant={mode == MeasureDistanceMode ? "contained" : "outlined"}        >
          {mode == MeasureDistanceMode ? t('cancel_draw_circle') : t('measurement_draw')}
        </Button>
      </div>
      <h5>{t('area')}</h5>
      <div className={styles.circle_analysis_btn}>
        <Button
          onClick={(e) => setMeasureAreaMode()}
          variant={mode == MeasureAreaMode ? "contained" : "outlined"}        >
          {mode == MeasureAreaMode ? t('cancel_draw_circle') : t('measurement_draw')}
        </Button>
      </div>
      <h5>{t('angle')}</h5>
      <div className={styles.circle_analysis_btn}>
        <Button
          onClick={(e) => setMeasureAngleMode()}
          variant={mode == MeasureAngleMode ? "contained" : "outlined"}        >
          {mode == MeasureAngleMode ? t('cancel_draw_circle') : t('measurement_draw')}
        </Button>
      </div>
    </div>
  </div>)
}