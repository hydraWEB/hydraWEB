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
                    "your_email":"Your Email Address",
                    "admin": "admin",
                    "language": "Language",
                    "announcement": "announcement",
                    "account": "account",
                }
            },
            zh_tw: {
                translations: {
                    "admin": "管理員",
                    "language": "語言切換",
                    "announcement": "公告",
                    "account": "個人帳號",
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