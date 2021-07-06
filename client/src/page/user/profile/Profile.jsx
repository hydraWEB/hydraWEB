import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styles from "./Profile.module.scss";
import styled from "@emotion/styled";
import NormalButton from "../../../component/NormalButton";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import News from "../news/News";
import UserData from "./UserData";
import Setting from "./Setting";

export default function Profile() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <span className={styles.title}>個人帳號</span>
                    <NormalButton link={"/user/profile/userdata"} isLightOn={location.pathname === "/user/profile/userdata"} text="個人資料" icon={faUser} />
                    <NormalButton link={"/user/profile/setting"} isLightOn={location.pathname === "/user/profile/setting"} text="設定" icon={faUser} />
                </div>
            </div>
            <div className={styles.profile_container} >
                <Switch>
                    <Route path="/user/profile/userdata">
                        <UserData />
                    </Route>
                    <Route path="/user/profile/setting">
                        <Setting />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}