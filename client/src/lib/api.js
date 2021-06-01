import axios from "axios";

//初始化
export let guestRequest_client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_PRODUCTION_CLIENT,
    headers: { "Content-Type": "application/json" }
});
export let userRequest_client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_PRODUCTION_CLIENT,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});


export const userLogin = () => guestRequest_client.post("api/v1/user/login");

export default userLogin