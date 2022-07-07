import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";



i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "platform_name": "Data Calculation Platform For Hydrology And Stratum Subsidence Monitoring",
                    "your_email": "Your Email Address",
                    "admin": "Admin",
                    "language": "Language",
                    "announcement": "Announcement",
                    "account": "Account",
                    "search": "Search",
                    "layer": "Layer",
                    "3D_switch": "3D Switch",
                    "circle_analysis": "Circle Analysis",
                    'print': "Print",
                    'locate': "Locate",
                    "setting": "Setting",
                    "user_data": "User Data",
                    "login_summary": "Login Summary",
                    "system_function_usage": "System Function Usage",
                    "system_setting": "System Setting",
                    "announcement_setting": "Announcement Setting",
                    "account_manage": "Account Manage",
                    "ip_manage": "IP Setting",
                    "draw": "Draw",
                    "longitude": "Longitude",
                    "latitude": "Latitude",
                    "zoom": "Zoom",
                    "angle": "Angle",
                    "search_by_tag": "Search By Tag",
                    "tags": "Tags",
                    "measurement": "measurement",
                    "waterlevel": "Water Level",
                    "new_password": "Password",
                    "info": "Info",
                    "function" : "Function",
                    "upload" : "Upload", 
                    "time_series_data" : "Time Series Data",
                    "gnss" : "GNSS",
                    //環域分析
                    "radius": "Radius",
                    "center_point": "Center Point",
                    "draw_circle": "Draw Circle",
                    "cancel_draw_circle": "cancel",
                    "all_tags": "All Tags",
                    "tags_loading_success": "Tag Load Success",
                    "tags_loading_fail": "Tag Load Fail",
                    //列印
                    "unit": "Unit",
                    "inch": "Inch",
                    "meter": "Meter",
                    "output_format": "Output Format",
                    //使用者資料
                    "user_profile": "User Profile",
                    "id": "ID",
                    "name": "Name",
                    "email": "Email",
                    "phone": "Phone",
                    "logout": "Logout",
                    //帳號管理
                    "username": "Username",
                    "register_date": "Register Date",
                    "change_password": "Change Password",
                    "old_password": "Old Password",
                    "comfirm_password": "Comfirm Password",
                    //公告管理
                    "publisher": "Publisher",
                    "create_date": "Create Date",
                    "edit_date": "Edit Date",
                    "operation": "Operation",
                    "check": "Check",
                    "edit": "Edit",
                    "delete": "Delete",
                    "are_you_sure_you_want_to_delete?": "Are You Sure You Want To Delete?",
                    "close": "Close",
                    "new_announcement": "New Announcement",
                    //公告管理(修改)
                    "edit_announcement": "Edit Announcement",
                    "title": "Title",
                    "content": "Content",
                    "confirm": "Confirm",
                    //公告管理(查看)
                    "check_announcement": "Check Announcement",
                    //登入統計
                    "login_date": "Login Date",
                    "year": "Year",
                    "month": "Month",
                    "whole_year":"Whole Year",
                    //系統功能使用記錄
                    "system_name": "System Name",
                    "use_time": "Use Time",
                    //IP管理
                    "ip_address": "IP Address",
                    "black_list": "Black List",
                    "new_ip_address": "New IP Address",
                    //系統設定
                    "change": "Change",
                    //水位
                    "select_coordinate": "Select Coordinate",
                    "water_level": "Water Level",
                    "help": "Help",
                    "loading": "Loading",
                    "select_area": "Select Area",
                    "select_min_time": "Select Minium Time",
                    "select_max_time": "Select Maxium Time",
                    "select_avg_time": "Average Time",
                    "download": "Download",
                    //圖片
                    "image": "Image",
                    "image_loading_success":"Image Load Success",
                    "image_loading_fail": "Image Load Fail",
                    //使用簡介
                    "tutorial": "Tutorial",
                    //計劃概述
                    "overview": "Overview",
                    //loading
                    "water_level_loading_fail": "Water Level Load Fail",
                    "water_level_loading_success": "Water Level Load Success",
                    "layer_loading_fail": "Layer Load Fail",
                    "layer_loading_success": "Layer Load Success",
                    //upload
                    "Upload_success" : "Upload Success",
                    "Upload_fail" : "Upload Fail",
                    "Upload_file" : "Upload File",
                    "convert_to_csv_and_upload" : "Convert To CSV And Upload",
                    "convert_to_json_and_upload" : "Convert To JSON And Upload",
                    "convert_to_geojson_and_upload" : "Convert To GEOJSON And Upload",
                    "convert_to_shapefile_and_upload" : "Convert To Shapefile And Upload",
                    "download_file":"Download File",
                    "downloading":"Downloading",
                    "download_complete":"Download Complete",
                    //測量
                    "measurement_draw": "Draw",
                    "distance": "Distance",
                    "area": "Area",
                    //提示
                    "login_success": "Login Success",
                    "login_fail": "Login Fail",
                    "password_reset_success": "Reset Link Has Been Sent To Your Email",
                    "error": "Error",
                    "sign_up_success": "Sign Up Success",
                    "sign_up_fail": "Sign Up Fail",
                    "logout_success": "Logout Success",
                    "announcement_create_success": "Announcement Has Been Created Successfully",
                    "announcement_edit_success": "Announcement Has Been Edited Successfully",
                    "announcement_delete_success": "Announcement Has Been Removed Successfully",
                    "account_edit_success": "Account Has Been Edited Successfully",
                    "account_delete_success": "Account Has Been Removed Successfully",
                    "ip_create_success": "IP Has Been Created Successfully",
                    "ip_delete_success": "IP Has Been Removed Successfully",
                    "password_changed_success":"Password Changed Successfully",
                    "password_changed_fail":"Password Changed Unsuccessfully",
                    "user_profile_changed_success":"User Profile Has Been Changed Successfully",
                    "user_profile_changed_fail":"User Profile Has Been Changed Unsuccessfully",
                    //login page
                    "your_password":"Your Password",
                    "login":"Login",
                    "sign_up":"Sign Up",
                    "forgot_your_password":"Forgot Your Password",
                    //sign up page
                    "home":"Home",
                    "your_username":"Enter Your Username",
                    "your_phone":"Enter Your Phone",
                    "enter_again":"Enter Your Password Again",
                    "confirm_password":"Confirm Your Password",
                    //forgot passsword page
                    "send":"Send",
                    //reset password page
                    "reset_password":"Reset Password",
                    "reset_password_token_is_invalid":"Reset Password Token Is Invalid",
                    //MapStyle
                    "map_style":"Map Style",
                    "select_map_style":"Select Map Style",
                    //GNSS
                    "execute": "Execute"
                }
            },
            zh_tw: {
                translations: {
                    "platform_name": "濁水溪沖積扇水文與地層下陷監測展示平台",
                    "your_email": "您的電子信箱",
                    "admin": "管理員",
                    "language": "語言切換",
                    "announcement": "公告",
                    "account": "個人帳號",
                    "search": "搜尋",
                    "layer": "圖層套疊",
                    "3D_switch": "3D轉換",
                    "circle_analysis": "環域分析",
                    'print': "列印",
                    'locate': "定位",
                    "setting": "設定",
                    "user_data": "個人資料",
                    "login_summary": "登入統計",
                    "system_function_usage": "系統功能使用記錄",
                    "system_setting": "系統設定",
                    "announcement_setting": "公告管理",
                    "account_manage": "帳號管理",
                    "ip_manage": "IP管理",
                    "draw": "繪圖",
                    "longitude": "經度",
                    "latitude": "緯度",
                    "zoom": "縮放",
                    "angle": "角度",
                    "search_by_tag": "透過標籤搜尋",
                    "tags": "標籤",
                    "measurement": "測量",
                    "waterlevel": "水位",
                    "new_password": "密碼",
                    "info": "資訊",
                    "map_style" : "地圖樣式",
                    "function" : "功能",
                    "upload" : "上傳", 
                    "time_series_data" : "時序資料",
                    "gnss" : "全球衛星導航系統",
                    //環域分析
                    "radius": "半徑",
                    "center_point": "中心點",
                    "draw_circle": "繪製區域",
                    "cancel_draw_circle": "取消",
                    "all_tags": "所有標籤",
                    "tags_loading_success": "標籤載入成功",
                    "tags_loading_fail": "標籤載入失敗",
                    //列印
                    "unit": "單位",
                    "inch": "英吋",
                    "meter": "公尺",
                    "output_format": "輸出格式",
                    //使用者資料
                    "user_profile": "使用者資料",
                    "id": "編號",
                    "name": "名字",
                    "email": "電子郵件",
                    "phone": "電話",
                    "logout": "登出",
                    //帳號管理
                    "username": "用戶名",
                    "register_date": "註冊日期",
                    "change_password": "修改密碼",
                    "old_password": "舊密碼",
                    "comfirm_password": "確認密碼",
                    //公告管理
                    "publisher": "發布者",
                    "create_date": "創建日期",
                    "edit_date": "修改日期",
                    "operation": "操作",
                    "check": "查看",
                    "edit": "修改",
                    "delete": "刪除",
                    "are_you_sure_you_want_to_delete?": "確定要刪除",
                    "close": "關閉",
                    "new_announcement": "新增公告",
                    //公告管理(修改)
                    "edit_announcement": "修改公告",
                    "title": "標題",
                    "content": "內容",
                    "confirm": "確認",
                    //公告管理(查看)
                    "check_announcement": "查看公告",
                    //登入統計
                    "login_date": "登入時間",
                    "year": "年",
                    "month": "月",
                    "whole_year":"全年度",
                    //系統功能使用記錄
                    "system_name": "系統設定",
                    "use_time": "使用時間",
                    //IP管理
                    "ip_address": "IP地址",
                    "black_list": "黑名單",
                    "new_ip_address": "新增IP地址",
                    //系統設定
                    "change": "切換",
                    //水位
                    "select_coordinate": "選擇坐標",
                    "water_level": "水位",
                    "help": "幫助",
                    "loading": "載入中",
                    "select_area": "選擇區域",
                    "select_min_time": "選擇最小時間",
                    "select_max_time": "選擇最大時間",
                    "select_avg_time": "平均時間",
                    "download": "下載",
                    //圖片
                    "image": "圖片",
                    "image_loading_success":"圖片載入成功",
                    "image_loading_fail":"圖片載入失敗",
                    //使用簡介
                    "tutorial": "使用簡介",
                    //計劃概述
                    "overview": "計畫概述",
                    //loading
                    "water_level_loading_fail": "測站載入失敗",
                    "water_level_loading_success": "測站載入成功",
                    "layer_loading_fail": "圖層載入失敗",
                    "layer_loading_success": "圖層載入成功",
                    //upload
                    "Upload_success" : "上傳成功",
                    "Upload_fail" : "上傳失敗",
                    "Upload_file" : "上傳檔案",
                    "convert_to_csv_and_upload" : "轉化成CSV格式並上傳",
                    "convert_to_json_and_upload" : "轉化成JSON格式並上傳",
                    "convert_to_geojson_and_upload" : "轉化成GEOJSON格式並上傳",
                    "convert_to_shapefile_and_upload" : "轉化成Shapefile格式並上傳",
                    "download_file":"下載文件",
                    "downloading":"下載中",
                    "download_complete":"下載成功",
                    //測量
                    "measurement_draw": "繪製",
                    "distance": "距離",
                    "area": "面積",
                    //提示
                    "login_success": "登入成功",
                    "login_fail": "登入失敗",
                    "password_reset_success": "重設連結已經發送至信箱",
                    "error": "發生錯誤",
                    "sign_up_success": "註冊成功",
                    "sign_up_fail": "註冊失敗",
                    "logout_success": "登出成功",
                    "announcement_create_success": "新增公告成功",
                    "announcement_edit_success": "修改公告成功",
                    "announcement_delete_success": "刪除公告成功",
                    "account_edit_success": "修改帳號成功",
                    "account_delete_success": "刪除帳號成功",
                    "ip_create_success": "IP新增成功",
                    "ip_delete_success": "IP刪除成功",
                    "password_changed_success":"密碼修改成功",
                    "password_changed_fail":"密碼修改失敗",
                    "user_profile_changed_success":"使用者資料修改成功",
                    "user_profile_changed_fail":"使用者資料修改失敗",
                    //login page
                    "your_password":"您的密碼",
                    "login":"登入",
                    "sign_up":"註冊",
                    "forgot_your_password":"忘記密碼",
                    //sign up page
                    "home":"首頁",
                    "your_username":"您的使用者名稱",
                    "your_phone":"您的電話",
                    "enter_again":"再一次輸入",
                    "confirm_password":"確認密碼",
                    "password":"密碼",
                    //forgot passsword page
                    "send":"送出",
                    //reset password page
                    "reset_password":"重設密碼",
                    "reset_password_token_is_invalid":"重置密碼Token無效",
                    //MapStyle
                    "select_map_style":"選擇地圖樣式",
                    //GNSS
                    "execute": "執行"
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