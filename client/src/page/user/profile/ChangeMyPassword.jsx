import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { userProfile,accountChangePassword } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh, Title } from "../staff/Staff";
import useQuery from "../../../lib/hook";
import { useToasts } from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";



export default function ChangeMyPassword() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();
    const [username, setUsername] = useState("")
    const [id, setId] = useState("")
    const [isLoading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [email,setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword1, setNewPassword1] = useState("")
    const [newPassword2, setNewPassword2] = useState("")

    const submitForm = (e) => {
        accountChangePassword({
            old_password: oldPassword,
            password: newPassword1,
            password2: newPassword2,
            email: email
        }, id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success', autoDismiss: true });
        }).catch((err) => {

        }).finally(() => {

        })
    }
    
    useEffect(() => {
        userProfile().then((res) => {
            setIsLoaded(true)
            setEmail(res.data.data.user.email)
            setId(res.data.data.user.userid)
        }).catch((err) => {
            setIsError(true)
        }).finally(() => {
            setLoading(false)
        })
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