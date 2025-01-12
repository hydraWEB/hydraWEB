import React, {useContext, useState} from "react";
import {userContext} from "../../provider/UserProvider";
import styled from "@emotion/styled";
import userLogin, {userForgotPasswd, userSignUp} from "../../lib/api";
import {Alert, Breadcrumb, Button, Form} from "react-bootstrap";
import {useToasts} from "react-toast-notifications";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
const Title = styled.h2(
    props => ({
            marginRight: "10px",
        }
    ))

const FormForgotPasswd = styled.div(
    props => ({
        maxWidth:"700px",
        margin:"0 auto",
        paddingTop:"50px",
        paddingLeft:"50px",
        paddingRight:"50px"
    })
)
//忘記密碼功能
export default function ForgotPasswd() {
    const { t, i18n } = useTranslation();
    let history = useHistory();
    const [email, setEmail] = useState('')
    const [isLoading, setLoading] = useState(false)
    const { addToast } = useToasts();
    const [text, setText] = useState("")
    const [showWarning, setShowWarning] = useState(false)
    //點擊送出按鈕後的函式
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!isLoading){
            setLoading(true)
            userForgotPasswd({
                'email':email
            }).then((res)=>{
                addToast(t('password_reset_success'), { appearance: 'success',autoDismiss:true });                    setShowWarning(true)
                setShowWarning(false)
            }).catch((err)=>{
                addToast(t('error'), { appearance: 'error',autoDismiss:true });
                if (err.response.status === 400) {
                    setShowWarning(true)
                    let data = err.response.data
                    if (data.email != null) {
                        setText(data.email)
                    }
                }
            }).finally(()=>{
                setLoading(false)
            })
        }
    }

    return (
        <FormForgotPasswd>
            <Breadcrumb>
            <Breadcrumb.Item >
                    <Link to="/guest/login">{t("home")}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{t("forgot_your_password")}</Breadcrumb.Item>
            </Breadcrumb>
            <Form onSubmit={handleSubmit}>
                <Title>{t("forgot_your_password")}</Title>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t("email")}</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email}
                                  onChange={e => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                        {t("your_email")}
                    </Form.Text>

                </Form.Group>
                {showWarning &&
                <Alert variant='danger'>
                    {text}
                </Alert>
                }
                <Button
                    disabled={isLoading}
                    variant="primary" type="submit">
                    {isLoading ? '...' : t("send")}
                </Button>
            </Form>
        </FormForgotPasswd>
    )

}