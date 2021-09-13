
import styles from './HydraMap.module.scss';
import { useTranslation, Trans } from "react-i18next";

import {
  EditableGeoJsonLayer,
  ViewMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode 
} from "nebula.gl";

export default function Measurement() {
  const { t, i18n } = useTranslation();

  return (<div>
    <h4 className={styles.func_title}>{t('measurement')}</h4>
    <div className={styles.all_print}>
      <h5>距離</h5>
      <h5>面積</h5>
    </div>
  </div>)
}