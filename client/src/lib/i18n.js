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
                    "platform_name":"Data Calculation Platform For Hydrology And Stratum Subsidence Monitoring",
                    "your_email":"Your Email Address",
                    "admin": "Admin",
                    "language": "Language",
                    "announcement": "Announcement",
                    "account": "Account",
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
                    "account_manage":"Account Manage",
                    "ip_manage":"IP Setting",
                    "draw":"Draw",
                    "longitude":"Longitude",
                    "latitude":"Latitude",
                    "zoom":"Zoom",
                    "angle":"Angle",
                    "search_by_tag":"Search By Tag",
                    "tags":"Tags",
                    "measurement":"measurement",
                    "waterlevel":"Water Level",
                    "new_password":"Password",
                    "info":"Info",
                    //環域分析
                    "radius":"Radius",
                    "center_point":"Center Point",
                    "draw_circle":"Draw Circle",
                    "cancel_draw_circle":"cancel",
                    //列印
                    "unit":"Unit",
                    "inch":"Inch",
                    "meter":"Meter",
                    "output_format":"Output Format",
                    //使用者資料
                    "user_profile":"User Profile",
                    "id":"ID",
                    "name":"Name",
                    "email":"Email",
                    "phone":"Phone",
                    "logout":"Logout",
                    //帳號管理
                    "username":"Username",
                    "register_date":"Register Date",
                    "change_password":"Change Password",
                    "old_password":"Old Password",
                    "comfirm_password":"Comfirm Password",
                    //公告管理
                    "publisher":"Publisher",
                    "create_date":"Create Date",
                    "edit_date":"Edit Date",
                    "operation":"Operation",
                    "check":"Check",
                    "edit":"Edit",
                    "delete":"Delete",
                    "are_you_sure_you_want_to_delete?":"Are You Sure You Want To Delete?",
                    "close":"Close",
                    "new_announcement":"New Announcement",
                    //公告管理(修改)
                    "edit_announcement":"Edit Announcement",
                    "title":"Title",
                    "content":"Content",
                    "confirm":"Confirm",
                    //公告管理(查看)
                    "check_announcement":"Check Announcement",
                    //登入統計
                    "login_date":"Login Date",
                    "year":"Year",
                    "month":"Month",
                    //系統功能使用記錄
                    "system_name":"System Name",
                    "use_time":"Use Time",
                    //IP管理
                    "ip_address":"IP Address",
                    "black_list":"Black List",
                    "new_ip_address":"New IP Address",
                    //系統設定
                    "change":"Change",
                    //水位
                    "select_coordinate":"Select Coordinate",
                    "water_level":"Water Level",
                    "help":"Help",
                    "loading":"Loading",
                    "select_area":"Select Area",
                    "select_min_time":"Select Minium Time",
                    "select_max_time":"Select Maxium Time",
                    //使用簡介
                    "tutorial":"Tutorial",
                    //計劃概述
                    "overview":"Overview",
                    //loading
                    "water_level_loading_fail":"Water Level Load Fail",
                    "water_level_loading_success":"Water Level Load Success",
                    "layer_loading_fail":"Layer Load Fail",
                    "layer_loading_success":"Layer Load Success",
                    //測量
                    "measurement_draw":"Draw",
                    "distance":"Distance",
                    "area":"Area",
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
                    "account_manage":"帳號管理",
                    "ip_manage":"IP管理",
                    "draw":"繪圖",
                    "longitude":"經度",
                    "latitude":"緯度", 
                    "zoom":"縮放",
                    "angle":"角度",
                    "search_by_tag":"透過標籤搜尋",
                    "tags":"標籤",
                    "measurement":"測量",
                    "waterlevel":"水位",
                    "new_password":"密碼",
                    "info":"資訊",
                    //環域分析
                    "radius":"半徑",
                    "center_point":"中心點",
                    "draw_circle":"繪製區域",
                    "cancel_draw_circle":"取消",
                    //列印
                    "unit":"單位",
                    "inch":"英吋",
                    "meter":"公尺",
                    "output_format": "輸出格式",
                    //使用者資料
                    "user_profile":"使用者資料",
                    "id":"編號",
                    "name":"名字",
                    "email":"電子郵件",
                    "phone":"電話",
                    "logout":"登出",
                    //帳號管理
                    "username":"用戶名",
                    "register_date":"註冊日期",
                    "change_password":"修改密碼",
                    "old_password":"舊密碼",
                    "comfirm_password":"確認密碼",
                    //公告管理
                    "publisher":"發布者",
                    "create_date":"創建日期",
                    "edit_date":"修改日期",
                    "operation":"操作",
                    "check":"查看",
                    "edit":"修改",
                    "delete":"刪除",
                    "are_you_sure_you_want_to_delete?":"確定要刪除",
                    "close":"關閉",
                    "new_announcement":"新增公告",
                    //公告管理(修改)
                    "edit_announcement":"修改公告",
                    "title":"標題",
                    "content":"內容",
                    "confirm":"確認",
                    //公告管理(查看)
                    "check_announcement":"查看公告",
                    //登入統計
                    "login_date":"登入時間",
                    "year":"年",
                    "month":"月",
                    //系統功能使用記錄
                    "system_name":"系統設定",
                    "use_time":"使用時間",
                    //IP管理
                    "ip_address":"IP地址",
                    "black_list":"黑名單",
                    "new_ip_address":"新增IP地址",
                    //系統設定
                    "change":"切換",
                    //水位
                    "select_coordinate":"選擇坐標",
                    "water_level":"水位",
                    "help":"幫助",
                    "loading":"載入中",
                    "select_area":"選擇區域",
                    "select_min_time":"選擇最小時間",
                    "select_max_time":"選擇最大時間",
                    //使用簡介
                    "tutorial":"使用簡介",
                    //計劃概述
                    "overview":"計畫概述",
                    //loading
                    "water_level_loading_fail":"測站載入失敗",
                    "water_level_loading_success":"測站載入成功",
                    "layer_loading_fail":"圖層載入失敗",
                    "layer_loading_success":"圖層載入成功",
                    //測量
                    "measurement_draw":"繪製",
                    "distance":"距離",
                    "area":"面積",
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