import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { accountInfoUser,accountChangePassword } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import { useToasts } from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";
//修改密碼的功能
export default function AccountManageChangePassword() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();
    const [username, setUsername] = useState("")
    const [id, setId] = useState("")
    const [email,setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword1, setNewPassword1] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    //點擊確認按鈕後執行的函式
    const submitForm = (e) => {
        let id = query.get("id")
        accountChangePassword({
            old_password: oldPassword,
            password: newPassword1,
            password2: newPassword2,
            email: email
        }, id
        ).then((res) => {
            addToast(t('password_changed_success'), { appearance: 'success', autoDismiss: true });
        }).catch((err) => {
            addToast(t('password_changed_fail'), { appearance: 'error', autoDismiss: true });
        }).finally(() => {

        })
    }
    //初始化時執行裡面的程式
    useEffect(() => {
        if (typeof query.get("id") !== 'undefined' && query.get("id") != null) {
            let id = query.get("id")
            accountInfoUser({}, id)
                .then((res) => {
                    setUsername(res.data.username)
                    setId(res.data.id)
                    setEmail(res.data.email)
                }).catch((err) => {

                }).finally(() => {

                })
        } else {

        }
    }, [])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/account-manage">{t('account_manage')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('user_profile')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('change_password')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('old_password')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('new_password')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('comfirm_password')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e) => submitForm(e)}>{t('confirm')}</Button>
        </div>
    )
}