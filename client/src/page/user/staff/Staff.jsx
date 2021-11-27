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
import IPManageNew from "./IPManageNew";
import {useTranslation} from "react-i18next";
import AnnouncementNew from "./AnnouncementNew";
import AnnouncementEdit from "./AnnouncementEdit"
import AnnouncementInfo from "./AnnouncementInfo"
import AccountManageNew from "./AccountManageNew"
import AccountManageEdit from "./AccountManageEdit"
import AcountManageInfo from "./AcountManageInfo"
import SystemUpdating from "./SystemUpdating"


export const Title = styled.h1(
    props => ({
        fontSize: "21px",
        fontWeight:"bold",
        margin: "30px 10px 20px 0px",
    })
)

export const FlexColumnContainer = styled.div(
    props => ({
        display: "flex",
    })
)

export const StyledTh = styled.th(
    props => ({
        color:"black"
    })
)

export const StyledTd = styled.td(
    props => ({
        color:"black"
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
                    <span className={styles.title}>{t("admin")}</span>
                    <NormalButton link={"/user/staff/login-analytics"}
                                  isLightOn={location.pathname === "/user/staff/login-analytics"} text={t('login_summary')}/>
                    <NormalButton link={"/user/staff/system-used-analytics"}
                                  isLightOn={location.pathname === "/user/staff/system-used-analytics"} text={t('system_function_usage')}/>
                    <NormalButton link={"/user/staff/announcement-manage"}
                                  isLightOn={location.pathname === "/user/staff/announcement-manage" || location.pathname === "/user/staff/announcement-manage/new" || location.pathname === "/user/staff/announcement-manage/edit" || location.pathname === "/user/staff/announcement-manage/info" } text={t('announcement_setting')}/>
                    <NormalButton link={"/user/staff/account-manage"}
                                  isLightOn={location.pathname === "/user/staff/account-manage" || location.pathname === "/user/staff/account-manage/new" || location.pathname === "/user/staff/account-manage/edit" || location.pathname === "/user/staff/account-manage/info" } text={t('account_manage')}/>
                    <NormalButton link={"/user/staff/ip-manage"} isLightOn={location.pathname === "/user/staff/ip-manage" || location.pathname === "/user/staff/ip-manage/new"}
                                  text={t('ip_manage')}/>
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
                    <Route path="/user/staff/account-manage/info">
                        <AcountManageInfo/>
                    </Route>
                    <Route path="/user/staff/account-manage/edit">
                        <AccountManageEdit/>
                    </Route>
                    <Route path="/user/staff/account-manage/new">
                        <AccountManageNew/>
                    </Route>
                    <Route path="/user/staff/account-manage">
                        <AccountManage/>
                    </Route>
                    <Route path="/user/staff/ip-manage/new">
                        <IPManageNew/>
                    </Route>
                    <Route path="/user/staff/ip-manage">
                        <IPManage/>
                    </Route>
                    <Route path="/user/staff/system-updating">
                        <SystemUpdating/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}