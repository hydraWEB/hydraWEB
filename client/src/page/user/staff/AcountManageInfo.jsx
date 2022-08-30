import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { accountInfoUser, accountSendEdit } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import { useTranslation, Trans } from "react-i18next";
//查看使用者帳號的功能
export default function AcountManageInfo() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")
    const [phone, setPhone] = useState("")
    //每當query變化時執行裡面的函式
    useEffect(() => {
        if (typeof query.get("id") !== 'undefined' && query.get("id") != null) {
            let id = query.get("id")
            accountInfoUser({}, id)
                .then((res) => {
                    setUsername(res.data.username)
                    setEmail(res.data.email)
                    setId(res.data.userid)
                    setPhone(res.data.phone)
                }).catch((err) => {

                }).finally(() => {

                })
        } else {

        }
    }, [query])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/account-manage">{t('account_manage')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('user_profile')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('user_profile')}</Title>
            <div>
                <p>{t('id')}: {id}</p>
                <p>{t('name')}: {username}</p>
                <p>{t('email')}: {email}</p>
                <p>{t('phone')}: {phone}</p>
            </div>
        </div>
    )
}