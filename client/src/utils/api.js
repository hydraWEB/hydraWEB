import axios from "axios";

//初始化
let guestRequest = axios.create({
    baseURL: process.env.REACT_APP_URL_LOCALHOST,
    headers: { "Content-Type": "application/json" }
});
let userRequest = axios.create({
    baseURL: process.env.REACT_APP_URL_LOCALHOST,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});

//正式機
if (process.env.REACT_APP_ENV === "production") {
    //不需要authorization
    guestRequest = axios.create({
        baseURL: process.env.REACT_APP_URL_PRODUCTION,
        headers: { "Content-Type": "application/json" }
    });
    //需要authorization
    userRequest = axios.create({
        baseURL: process.env.REACT_APP_URL_PRODUCTION,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });
}

//本地測試機
if (process.env.REACT_APP_ENV === "local") {
    //不需要authorization
    guestRequest = axios.create({
        baseURL: process.env.REACT_APP_URL_LOCALHOST,
        headers: { "Content-Type": "application/json" }
    });
    //需要authorization
    userRequest = axios.create({
        baseURL: process.env.REACT_APP_URL_LOCALHOST,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });
}

//統一管理 API Call
//data: 放資料
//config: 放header資料, 像是authorization

//id 0
export const signup = config =>
    guestRequest.post("api/v1/guest/signup", config);
export const login= config =>
    guestRequest.post("api/v1/guest/login", config);
export const getUserInfo = config =>
    userRequest.get("api/v1/users/info", config);
export const customerSendOrderAPI = (config, data) =>
    userRequest.post("api/v1/users/customer/order/send", config, data);
