import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {accountInfoUser,accountSendNew} from "../../../lib/api";
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
        accountSendNew({
                username:username,
                email:email,
                id:id,
                phone:phone
            },id
        ).then((res) => {
            addToast('新增成功.', { appearance: 'success',autoDismiss:true });
            history.push(`/user/staff/account-manage`)
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
            <Title>{t('user_profile')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>{t('id')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={id} onChange={(e)=>setId(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('phone')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>{t('confirm')}</Button>
        </div>
    )
}