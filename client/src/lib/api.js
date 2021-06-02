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

export default userLogin