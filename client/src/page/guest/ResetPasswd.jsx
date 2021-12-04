import React, {useContext, useEffect, useState} from "react";
import {userContext} from "../../provider/UserProvider";
import styled from "@emotion/styled";
import userLogin, {
    userForgotPasswd,
    userForgotPasswdCheckToken,
    userForgotPasswdConfirm,
    userSignUp
} from "../../lib/api";
import {Alert, Breadcrumb, Button, Form} from "react-bootstrap";
import './SignUp.module.scss';
import {useToasts} from "react-toast-notifications";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const Title = styled.h2(
    props => ({
            marginRight: "10px",
        }
    ))

const FormLogin = styled.div(
    props => ({
        padding: "50px",
        maxWidth: "700px",
        margin: "0 auto",
    })
)

const ImgContainer = styled.div(
    props => ({
        margin: "0 auto",
        display:"flex",
        justifyContent:"center"
    })
)

export default function ResetPasswd({match}) {

    let defaultMsg = {
        token: {
            isShow: false,
            msg: ""
        },
        password: {
            isShow: false,
            msg: ""
        },
        password_check: {
            isShow: false,
            msg: ""
        }
    }

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    let history = useHistory();
    const {addToast} = useToasts();
    const { t, i18n } = useTranslation();
    const [loadingCheckedToken, setLoadingCheckedToken] = useState(true)
    const [checkedToken, setCheckedToken] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [errMsg, setErrMsg] = useState(defaultMsg)

    useEffect(() => {
        userForgotPasswdCheckToken(
            {
                token: token,
            }
        ).then(() => {
            setCheckedToken(true)
        }).catch((err) => {
            setCheckedToken(false)
        }).finally(() => {
            setLoadingCheckedToken(false)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isLoading) {
            setLoading(true)
            userForgotPasswdConfirm({
                token: token,
                password: password,
                password_check: passwordCheck,
            }).then((res) => {
                addToast(t('password_reset_success'), {appearance: 'success', autoDismiss: true});
                history.push("/guest/login")
            }).catch((err) => {
                addToast(t('error'), {appearance: 'error', autoDismiss: true});
                if (err.response.status === 400) {
                    let msg = defaultMsg
                    let data = err.response.data
                    if (data.email != null) {
                        msg.email.isShow = true
                        msg.email.msg = data.email
                    }
                    if (data.password != null) {
                        msg.password.isShow = true
                        msg.password.msg = data.password
                    }
                    if (data.password_check != null) {
                        msg.password_check.isShow = true
                        msg.password_check.msg = data.password_check
                    }
                    setErrMsg(msg)
                }

            }).finally(() => {
                setLoading(false)
            })
        }
    }
    return (
        <FormLogin>
            <Breadcrumb>
                <Breadcrumb.Item >
                    <Link to="/guest/login">{t("home")}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{t("reset_password")}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t("reset_password")}</Title>
            { !loadingCheckedToken &&
                <>
                    {checkedToken &&
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>{t("new_password")}</Form.Label>
                            {errMsg.password.isShow &&
                            <Alert variant='danger'>
                                {errMsg.password.msg}
                            </Alert>
                            }
                            <Form.Control type="password" placeholder="Password" value={password}
                                          onChange={e => setPassword(e.target.value)}/>
                            <Form.Text className="text-muted">
                                {t("your_password")}
                            </Form.Text>

                        </Form.Group>

                        <Form.Group controlId="formBasicPasswordCheck">
                            <Form.Label>{t("confirm_password")}</Form.Label>
                            {errMsg.password_check.isShow &&
                            <Alert variant='danger'>
                                {errMsg.password_check.msg}
                            </Alert>
                            }
                            <Form.Control type="password" placeholder="Password" value={passwordCheck}
                                          onChange={e => setPasswordCheck(e.target.value)}/>
                            <Form.Text className="text-muted">
                                {t("enter_again")}
                            </Form.Text>

                        </Form.Group>

                        <Button
                            disabled={isLoading}
                            variant="primary" type="submit">
                            {isLoading ? '...' : t('send')}
                        </Button>
                    </Form>
                    }
                    {!checkedToken &&
                    <p>{t("reset_password_token_is_invalid")}</p>
                    }
                </>


            }
            { loadingCheckedToken &&
                <ImgContainer>
                    <img src="/img/loading.svg"/>
                </ImgContainer>
            }
        </FormLogin>
    )

}
