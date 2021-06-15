import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styles from "./Staff.module.scss";
import styled from "@emotion/styled";
import LinkButton from "../../../component/LinkButton";
import {faUser} from "@fortawesome/free-solid-svg-icons";

export default function Staff() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <LinkButton link={"/user/staff/login-analytics"} isLightOn={location.pathname === "/user/staff/login-analytics"} text="登入統計"/>
                    <LinkButton link={"/user/staff/system-used-analytics"} isLightOn={location.pathname === "/user/staff/system-used-analytics"} text="系統功能使用紀錄" />
                    <LinkButton link={"/user/staff/system-used-analytics"} isLightOn={location.pathname === "/user/staff/system-used-analytics"} text="系統功能使用紀錄" />

                </div>
            </div>
            <div className={styles.profile_container} >
                <Switch>
                    <Route path="/user/staff/">

                    </Route>
                </Switch>
            </div>
        </div>
    )
}