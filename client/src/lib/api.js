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
export const userProfileEdit = (data) => userRequest_client.put("api/v1/auth/user/profile/edit",data)

export const accountList = (data) => userRequest_client.get("api/v1/staff/account",data)
export const accountSendNew = (data) => userRequest_client.post("api/v1/staff/account",data)
export const accountSendEdit = (data,id) => userRequest_client.put(`api/v1/staff/account/${id}/`,data)
export const accountSendDelete = (id) => userRequest_client.delete(`api/v1/staff/account/${id}/`)
export const accountInfoUser = (data,id) => userRequest_client.get(`api/v1/staff/account/${id}/`,data)

export const accountChangePassword = (data,id) => userRequest_client.put(`api/v1/staff/change-password/${id}/`,data)
export const myaccountChangePassword = (data) => userRequest_client.post(`api/v1/staff/change-password/`,data)

export const loginLog = (data) => userRequest_client.get("api/v1/staff/system-log",data)
export const systemLogGetAllYear = () => userRequest_client.get("api/v1/staff/system-log/get-all-years")

export const AnnouncementList = (data) => userRequest_client.get("api/v1/staff/announcement/",data)
export const AnnouncementSendNew = (data) => userRequest_client.post("api/v1/staff/announcement/",data)
export const AnnouncementSendEdit = (data,id) => userRequest_client.put(`api/v1/staff/announcement/${id}/`,data)
export const AnnouncementSendDelete = (id) => userRequest_client.delete(`api/v1/staff/announcement/${id}/`)
export const AnnouncementListUser = (data) => userRequest_client.get("api/v1/staff/announcement/",data)
export const AnnouncementInfoUser = (data,id) => userRequest_client.get(`api/v1/staff/announcement/${id}/`,data)


export const LayerList = (data) => userRequest_client.get(`api/v1/user/layer`,data)
export const WaterLevelAllStations = () => userRequest_client.get(`api/v1/user/water_level/stations`)
export const WaterLevelGetDataByStNo = (data) => userRequest_client.post(`api/v1/user/water_level/getByID`,data)

export const SystemSettingList = (data) => userRequest_client.get(`api/v1/staff/system-updating/`,data)
export const SystemSettingEdit = (data,id) => userRequest_client.put(`api/v1/staff/system-updating/${id}/`,data)

export const IPList = (data) => userRequest_client.get("api/v1/staff/ip/",data)
export const IPSendDelete = (id) => userRequest_client.delete(`api/v1/staff/ip/${id}/`)
export const IPSendNew = (data) => userRequest_client.post("api/v1/staff/ip/",data)



export default userLogin