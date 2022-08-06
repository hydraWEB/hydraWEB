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

export let userUploadRequest_client = axios.create({
    baseURL: process.env.REACT_APP_URL_PRODUCTION,
    headers: { 
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary"
    },
    withCredentials: true
});

export let userDownloadRequest_client = axios.create({
    baseURL: process.env.REACT_APP_URL_PRODUCTION,
    headers: { "Content-Type": "application/json" },
    responseType: 'arraybuffer',
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


export const LayerList = (data) => userRequest_client.post(`api/v1/user/layer`,data)
export const PartLayerList = (data) => userRequest_client.post(`api/v1/user/partLayer`,data)
export const AccordionNameList = () => userRequest_client.get(`api/v1/user/accordionName`)
export const ChoushuiLayerList = (data) => userRequest_client.post(`api/v1/user/choushuiEditLayer`,data)
export const WaterLevelAllStations = () => userRequest_client.get(`api/v1/user/water_level/stations`)
export const WaterLevelGetDataByStNo = (data) => userRequest_client.post(`api/v1/user/water_level/getByID`,data)
export const WaterLevelDownloadByStNo = (data) => userRequest_client.post(`api/v1/user/water_level/download`,data)
export const BackendImg = () => userRequest_client.get(`api/v1/user/img`)

export const SystemSettingList = (data) => userRequest_client.get(`api/v1/staff/system-updating/`,data)
export const SystemSettingEdit = (data,id) => userRequest_client.put(`api/v1/staff/system-updating/${id}/`,data)

export const IPList = (data) => userRequest_client.get("api/v1/staff/ip/",data)
export const IPSendDelete = (id) => userRequest_client.delete(`api/v1/staff/ip/${id}/`)
export const IPSendNew = (data) => userRequest_client.post("api/v1/staff/ip/",data)

export const AllTags = () => userRequest_client.post(`api/v1/user/all_tag`)
export const TagAndGIS = () => userRequest_client.get(`api/v1/user/tagAndGIS`)

export const UploadOriginalFile = (data) => userUploadRequest_client.post(`api/v1/user/uploadFile/original`,data)
export const DownloadFileList = () => userRequest_client.post(`api/v1/user/DownloadFileList`)
export const DownloadFile = (data) => userRequest_client.post(`api/v1/user/downloadFile`,data)
export const DownloadBufferFile = (data) => userDownloadRequest_client.post(`api/v1/user/downloadFile`,data)
export const DownloadMapData = (data) => userDownloadRequest_client.post(`api/v1/user/downloadMapData`,data)

export const GnssFunction = (data) => userRequest_client.post(`api/v1/user/GnssFunction`,data)
export const GnssTextBox = (data) => userRequest_client.post(`api/v1/user/GNSSTextBox`,data)
export const GnssUpload = (data) => userUploadRequest_client.post(`api/v1/user/uploadGNSS`,data)

export default userLogin