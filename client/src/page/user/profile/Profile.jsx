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
import Announcement from "../announcement/Announcement";
import UserData from "./UserData";
import Setting from "./Setting";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";

export default function Profile() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const {t, i18n} = useTranslation();
    const { addToast } = useToasts();

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <span className={styles.title}>{t("account")}</span>
                    <NormalButton link={"/user/profile/userdata"} isLightOn={location.pathname === "/user/profile/userdata"} text={t('user_data')} icon={faUser} />
                    <NormalButton link={"/user/profile/setting"} isLightOn={location.pathname === "/user/profile/setting"} text={t('setting')} icon={faUser} />
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