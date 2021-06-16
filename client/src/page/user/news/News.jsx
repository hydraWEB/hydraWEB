import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styles from "./News.module.scss";
import styled from "@emotion/styled";
import LinkButton from "../../../component/LinkButton";
import {faUser} from "@fortawesome/free-solid-svg-icons";

export default function News() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <span className={styles.title}>公告</span>
                    <LinkButton link={""} isLightOn={false} text="測試公告" icon={faUser} />
                </div>
            </div>
            <div className={styles.profile_container} >

            </div>
        </div>
    )
}