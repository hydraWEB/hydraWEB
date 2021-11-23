import styles from './Tutorial.module.scss'
import { useTranslation, Trans } from "react-i18next";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  marginTop:10,
  borderRadius:15,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon  sx={{ fontSize: '0.9rem'} } />} 
    {...props}
  />
))(({ theme }) => ({
  borderRadius:10,
  minHeight: 60,
  color:"#FAFAFA",
  backgroundColor: '#3c3e41',
  flexDirection: 'row-reverse', 
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  color:"#000000",
  padding: theme.spacing(2)
}));


export default function Tutorial() {
  const { t, i18n } = useTranslation();

  const [expanded, setExpanded] = useState('search');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('tutorial')}</h3>
      <div className={styles.content}>
        <Accordion expanded={expanded === 'search'} onChange={handleChange('search')}>
          <AccordionSummary>
            <Typography>關鍵字搜尋</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/搜尋-標記標籤.png' alt="chart" />
              <p>
                1. 選擇各種標籤，輸入鍵值關鍵字來搜尋圖層資料當對應的資料相符時，其下方會顯示搜尋結果，使用者可點選瀏覽，或透過按下查看按鈕來確認座標位置。
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'layer'} onChange={handleChange('layer')}>
          <AccordionSummary>
            <Typography>圖層套疊</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/圖層套疊-標記打勾.png' alt="chart" />
              <p>
                2. 點擊紅色標記裡的格子可以讓對應的圖層資料顯示在地圖上，點擊藍色格子的區域會收起格子下方的圖層列
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'circle_analysis'} onChange={handleChange('circle_analysis')}>
          <AccordionSummary>
            <Typography>環域分析</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/環域分析-標記繪製區域.png' alt="chart" />
              <img className={styles.tutorial_img} src='/img/環域分析2-繪製區域.png' alt="chart" />
              <p>
                3. 點擊紅色標記的按鈕開始使用環域分析功能，之後在地圖上的任意的點點擊選擇圓的圓心，拖拉滑鼠選擇圓的大小。選擇好圓的大小之後左邊會顯示圓內的所有的資料
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'print'} onChange={handleChange('print')}>
          <AccordionSummary>
            <Typography>列印圖層</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/列印圖層.png' alt="chart" />
              <p>
                4. 點擊選擇圖片的輸出格式為PNG或PDF，之後點擊列印按鈕則列印出目前地圖上的所有資料
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'measurement'} onChange={handleChange('measurement')}>
          <AccordionSummary>
            <Typography>測量</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/測量-距離.png' alt="chart" />
              <p>
                5. 點擊距離的繪製按鈕之後在地圖上點選兩個點就可以將出兩點之間的距離
              </p>
              <img className={styles.tutorial_img} src='/img/測量-面積.png' alt="chart" />
              <p>
                6. 點擊面積的繪製按鈕之後在地圖上點好幾個點可以畫出多邊形並計算出地圖上多邊形的面積
              </p>
              <img className={styles.tutorial_img} src='/img/測量-角度.png' alt="chart" />
              <p>
                7. 點擊角度的繪製按鈕之後在地圖上點選兩個點就可以將出兩點之間的角度
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'water_level'} onChange={handleChange('water_level')}>
          <AccordionSummary>
            <Typography>水位</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <img className={styles.tutorial_img} src='/img/水位.png' alt="chart" />
              <p>
                8. 點擊紅色標記1選擇要查看的區域，紅色標記2和3選擇該區域的最小和最大時間，之後點擊紅色標記4做搜尋
              </p>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}