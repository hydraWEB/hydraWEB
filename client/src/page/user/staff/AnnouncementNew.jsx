import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {AnnouncementList, AnnouncementSendNew, loginLog, systemLogGetAllYear, userSignUp} from "../../../lib/api";
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

export default function AnnouncementNew() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();

    const [title,setTitle] = useState("")
    const [content,setContent] = useState("")

    const submitForm = (e) => {
        AnnouncementSendNew({
                title:title,
                content:content
            }
        ).then((res) => {
            addToast('新增成功.', { appearance: 'success',autoDismiss:true });
            history.push(`/user/staff/announcement-manage`)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/announcement-manage">{t('announcement_setting')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('new_announcement')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('new_announcement')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>{t('title')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('content')}</Form.Label>
                    <Form.Control as="textarea" rows={3}  value={content} onChange={(e)=>setContent(e.target.value)}  />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>{t('confirm')}</Button>

        </div>
    )
}