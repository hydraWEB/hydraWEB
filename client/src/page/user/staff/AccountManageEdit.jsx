import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {accountInfoUser,accountSendEdit} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import {StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import {useToasts} from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";

export default function AnnouncementEdit() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")
    const [phone, setPhone] = useState("")

    const submitForm = (e) => {
        let id =  query.get("id")
        accountSendEdit({
                username:username,
                email:email,
                id:id,
                phone:phone
            },id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success',autoDismiss:true });
        }).catch((err) => {

        }).finally(() => {

        })
    }

    useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            let id =  query.get("id")
            accountInfoUser({},id)
            .then((res) => {
                setUsername(res.data.username)
                setEmail(res.data.email)
                setId(res.data.id)
                setPhone(res.data.Phone)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, [])

    return (
        <div>
            <p>{t('user_profile')}</p>
                <div>
                    <p>{t('id')}: {id}</p>
                    <p>{t('name')}: {username}</p>
                    <p>{t('email')}: {email}</p>
                    <p>{t('phone')}: {phone}</p>
                </div>
        </div>
    )
}