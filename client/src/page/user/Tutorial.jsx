import styles from './Tutorial.module.scss'
import { useTranslation, Trans } from "react-i18next";
export default function Tutorial(){
  const { t, i18n } = useTranslation();
  return(
    <div className={styles.container}>
      <h3 className={styles.title}>{t('tutorial')}</h3>
      <div className={styles.content}>
        簡介
      </div>
    </div>)

}