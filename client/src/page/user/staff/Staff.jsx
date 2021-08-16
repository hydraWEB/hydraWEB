import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styles from "./Staff.module.scss";
import styled from "@emotion/styled";
import NormalButton from "../../../component/NormalButton";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import LoginAnalytics from "./LoginAnalytics";
import SystemUsedAnalytics from "./SystemUsedAnalystic";
import SystemSetting from "./SystemSetting";
import Announcement from "./Announcement";
import AccountManage from "./AccountManage";
import IPManage from "./IPManage";
import {useTranslation} from "react-i18next";
import AnnouncementNew from "./AnnouncementNew";
import AnnouncementEdit from "./AnnouncementEdit"
import AnnouncementInfo from "./AnnouncementInfo"
export const Title = styled.h1(
    props => ({
        fontSize: "20px",
        margin: "10px 10px 30px 0px",

    })
)

export const FlexColumnContainer = styled.div(
    props => ({
        display: "flex",
    })
)

export const StyledTh = styled.th(
    props => ({
        color:"white"
    })
)

export const StyledTd = styled.td(
    props => ({
        color:"white"
    })
)

export const StyledTable = styled.div(
    props => ({
        marginTop:"20px",
        marginBottom:"20px"
    })
)

export default function Staff() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const { t, i18n } = useTranslation();

    return (
        <div className={styles.wrapper}>
            <div className={styles.menu_desk}>
                <div className={styles.menu_desk_container}>
                    <span className={styles.title}>{t("account")}</span>
                    <NormalButton link={"/user/staff/login-analytics"}
                                  isLightOn={location.pathname === "/user/staff/login-analytics"} text={t('login_summary')}/>
                    <NormalButton link={"/user/staff/system-used-analytics"}
                                  isLightOn={location.pathname === "/user/staff/system-used-analytics"} text={t('system_function_usage')}/>
                    <NormalButton link={"/user/staff/system-setting"}
                                  isLightOn={location.pathname === "/user/staff/system-setting"} text={t('system_setting')}/>
                    <NormalButton link={"/user/staff/announcement-manage"}
                                  isLightOn={location.pathname === "/user/staff/announcement-manage" || location.pathname === "/user/staff/announcement-manage/new" || location.pathname === "/user/staff/announcement-manage/edit" || location.pathname === "/user/staff/announcement-manage/info" } text={t('announcement_setting')}/>
                    <NormalButton link={"/user/staff/account-manage"}
                                  isLightOn={location.pathname === "/user/staff/account-manage"} text={t('account_manage')}/>
                    <NormalButton link={"/user/staff/ip-manage"} isLightOn={location.pathname === "/user/staff/ip-manage"}
                                  text={t('ip_setting')}/>
                </div>
            </div>
            <div className={styles.profile_container}>
                <Switch>
                    <Route path="/user/staff/login-analytics">
                        <LoginAnalytics/>
                    </Route>
                    <Route path="/user/staff/system-used-analytics">
                        <SystemUsedAnalytics/>
                    </Route>
                    <Route path="/user/staff/system-setting">
                        <SystemSetting/>
                    </Route>
                    <Route path="/user/staff/announcement-manage/new">
                        <AnnouncementNew/>
                    </Route>
                    <Route path="/user/staff/announcement-manage/edit">
                        <AnnouncementEdit/>
                    </Route>
                    <Route path="/user/staff/announcement-manage/info">
                        <AnnouncementInfo/>
                    </Route>
                    <Route path="/user/staff/announcement-manage">
                        <Announcement/>
                    </Route>
                    <Route path="/user/staff/account-manage">
                        <AccountManage/>
                    </Route>
                    <Route path="/user/staff/ip-manage">
                        <IPManage/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}