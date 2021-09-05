import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { AnnouncementInfoUser, AnnouncementSendEdit } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import { useTranslation, Trans } from "react-i18next";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function AnnouncementInfo() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    useEffect(() => {
        if (typeof query.get("id") !== 'undefined' && query.get("id") != null) {
            let id = query.get("id")
            AnnouncementInfoUser({}, id)
                .then((res) => {
                    setTitle(res.data.title)
                    setContent(res.data.content)
                }).catch((err) => {

                }).finally(() => {

                })
        } else {

        }
    }, [query])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/announcement-manage">{t('announcement_setting')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('check_announcement')}</Breadcrumb.Item>
            </Breadcrumb>
            <Form>

                <Title>{title}</Title>

                <div
                    dangerouslySetInnerHTML={{
                        __html: content
                    }}></div>
            </Form>
        </div>
    )
}