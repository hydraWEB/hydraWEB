import React, {useContext, useState} from "react";
import {userContext} from "../../provider/UserProvider";
import styled from "@emotion/styled";
import userLogin, {userForgotPasswd, userSignUp} from "../../lib/api";
import {Alert, Breadcrumb, Button, Form} from "react-bootstrap";
import {useToasts} from "react-toast-notifications";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";

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

export default function ForgotPasswd() {

    let history = useHistory();
    const [email, setEmail] = useState('')
    const [isLoading, setLoading] = useState(false)
    const { addToast } = useToasts();
    const [text, setText] = useState("")
    const [showWarning, setShowWarning] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!isLoading){
            setLoading(true)
            userForgotPasswd({
                'email':email
            }).then((res)=>{
                addToast('重設連結已經發送至信箱', { appearance: 'success',autoDismiss:true });                    setShowWarning(true)
                setShowWarning(false)
            }).catch((err)=>{
                addToast('錯誤', { appearance: 'error',autoDismiss:true });
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
                    <Link to="/guest/login">首頁</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>忘記密碼</Breadcrumb.Item>
            </Breadcrumb>
            <Form onSubmit={handleSubmit}>
                <Title>忘記密碼</Title>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>電子信箱</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email}
                                  onChange={e => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的電子信箱
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
                    {isLoading ? '...' : '送出'}
                </Button>
            </Form>
        </FormForgotPasswd>
    )

}