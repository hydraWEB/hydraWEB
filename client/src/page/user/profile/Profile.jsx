import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext,useEffect,useState} from "react";
import {userSignUp,userProfile} from "../../../lib/api";
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
import ChangeMyPassword from "./ChangeMyPassword";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";

export default function Profile() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const {t, i18n} = useTranslation();
    const [id, setId] = useState("")
    const [changePasswordLink, setChangePasswordLink] = useState("")
    const { addToast } = useToasts();

    
    useEffect(() => {
        var userid = ""
        userProfile().then((res) => {
            userid = res.data.data.user.userid
            setId(res.data.data.user.userid)
        }).catch((err) => {
        }).finally(() => {
        })
        setChangePasswordLink("/user/profile/changepassword/" + userid)
        console.log(userid)
    }, [])

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <span className={styles.title}>{t("account")}</span>
                    <NormalButton link={"/user/profile/userdata"} isLightOn={location.pathname === "/user/profile/userdata"} text={t('user_data')} icon={faUser} />
                    <NormalButton link={"/user/profile/setting"} isLightOn={location.pathname === "/user/profile/setting"} text={t('setting')} icon={faUser} />
                    <NormalButton link={"/user/profile/changepassword"} isLightOn={location.pathname === "/user/profile/changepassword"} text={t('change_password')} icon={faUser} />
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
                    <Route path="/user/profile/changepassword">
                        <ChangeMyPassword />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}