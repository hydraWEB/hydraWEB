import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {AnnouncementInfoUser,AnnouncementSendEdit} from "../../../lib/api";
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

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//修改公告功能
export default function AnnouncementEdit() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();

    const [title,setTitle] = useState("")
    const [content,setContent] = useState("")
    //點擊送出按鈕後執行的函式
    const submitForm = (e) => {
        let id =  query.get("id")
        AnnouncementSendEdit({
                title:title,
                content:content
            },id
        ).then((res) => {
            addToast(t('account_edit_success'), { appearance: 'success',autoDismiss:true });
        }).catch((err) => {

        }).finally(() => {

        })
    }
    //初始化時執行一次裡面的程式
    useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            let id =  query.get("id")
            AnnouncementInfoUser({},id)
            .then((res) => {
                setTitle(res.data.title)
               setContent(res.data.content)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, [])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/announcement-manage">{t('announcement_setting')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('edit_announcement')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('edit_announcement')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>{t('title')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </Form.Group>
                <div className={styles.editor} >
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data)
                            console.log({ event, editor, data });
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </div>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>{t('confirm')}</Button>

        </div>
    )
}