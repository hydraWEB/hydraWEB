import axios from "axios";

//初始化
export let guestRequest_client = axios.create({
    baseURL: process.env.REACT_APP_URL_LOCALHOST,
    headers: { "Content-Type": "application/json" }
});
export let userRequest_client = axios.create({
    baseURL: process.env.REACT_APP_URL_PRODUCTION,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});


export const userLogin = (data) => guestRequest_client.post("api/v1/auth/login/",data);
export const userSignUp = (data) => guestRequest_client.post("api/v1/auth/register/",data);
export const userForgotPasswd = (data) => guestRequest_client.post("api/v1/auth/password_reset/",data);
export const userForgotPasswdCheckToken = (data) => guestRequest_client.post("api/v1/auth/password_reset/validate_token/",data);
export const userForgotPasswdConfirm = (data) => guestRequest_client.post("api/v1/auth/password_reset/confirm/",data);

export const userProfile = () => userRequest_client.get("api/v1/auth/user/profile");

export const accountList = (data) => userRequest_client.get("api/v1/staff/account",data)
export const loginLog = (data) => userRequest_client.get("api/v1/staff/system-log",data)
export const systemLogGetAllYear = () => userRequest_client.get("api/v1/staff/system-log/get-all-years")
export const AnnouncementList = (data) => userRequest_client.get("api/v1/staff/announcement/",data)
export const AnnouncementSendNew = (data) => userRequest_client.post("api/v1/staff/announcement/",data)
export const AnnouncementListUser = (data) => userRequest_client.get("api/v1/staff/announcement/",data)
export const AnnouncementInfoUser = (data,id) => userRequest_client.get(`api/v1/staff/announcement/${id}`,data)

export const LayerList = () => userRequest_client.get(`api/v1/user/layer`)


export default userLogin