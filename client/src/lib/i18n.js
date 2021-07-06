import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "platform_name":"Data calculation platform for hydrology and stratum subsidence monitoring",
                    "your_email":"Your Email Address",
                    "admin": "admin",
                    "language": "Language",
                    "announcement": "announcement",
                    "account": "account",
                    "search":"Search",
                    "layer":"Layer",
                    "3D_switch":"3D Switch",
                    "circle_analysis":"Circle Analysis",
                    'print':"Print",
                    'locate':"Locate",
                }
            },
            zh_tw: {
                translations: {
                    "platform_name":"水文與地層下陷監測資料運算平台",
                    "admin": "管理員",
                    "language": "語言切換",
                    "announcement": "公告",
                    "account": "個人帳號",
                    "search":"搜尋",
                    "layer":"圖層套疊",
                    "3D_switch":"搜尋",
                    "circle_analysis":"搜尋",
                    'print':"列印",
                    'locate':"定位",
                }
            }
        },
        fallbackLng: "en",
        debug: true,

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;