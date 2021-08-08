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
                    "setting":"Setting",
                    "user_data":"User Data",
                    "login_summary":"Login Summary",
                    "system_function_usage":"System Function Usage",
                    "system_setting":"System Setting",
                    "announcement_setting":"Announcement Setting",
                    "account_setting":"Account Setting",
                    "ip_setting":"IP Setting",
                    "draw":"draw",
                }
            },
            zh_tw: {
                translations: {
                    "platform_name":"濁水溪沖積扇水文與地層下陷監測展示平台",
                    "admin": "管理員",
                    "language": "語言切換",
                    "announcement": "公告",
                    "account": "個人帳號",
                    "search":"搜尋",
                    "layer":"圖層套疊",
                    "3D_switch":"3D轉換",
                    "circle_analysis":"環域分析",
                    'print':"列印",
                    'locate':"定位",
                    "setting":"設定",
                    "user_data":"個人資料",
                    "login_summary":"登入統計",
                    "system_function_usage":"系統功能使用記錄",
                    "system_setting":"系統設定",
                    "announcement_setting":"公告管理",
                    "account_setting":"帳號管理",
                    "ip_setting":"IP管理",
                    "draw":"繪圖",
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