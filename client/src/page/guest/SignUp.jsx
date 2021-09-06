import React, {useContext, useState} from "react";
import {userContext} from "../../provider/UserProvider";
import styled from "@emotion/styled";
import userLogin, {userSignUp} from "../../lib/api";
import {Alert, Breadcrumb, Button, Form} from "react-bootstrap";
import './SignUp.module.scss';
import {useToasts} from "react-toast-notifications";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";

const Title = styled.h2(
    props => ({
            marginRight: "10px",
        }
    ))

const FormLogin = styled.div(
    props => ({
        padding:"50px",
        maxWidth:"700px",
        margin:"0 auto",
    })
)

export default function SignUp() {

    let defaultMsg = {
        email: {
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
        },
        username: {
            isShow: false,
            msg: ""
        },
        phone: {
            isShow: false,
            msg: ""
        }
    }

    let history = useHistory();
    const {user, setUser} = useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [userName, setUserName] = useState('')
    const [phone, setPhone] = useState('')
    const [errMsg, setErrMsg] = useState(defaultMsg)
    const [isLoading, setLoading] = useState(false)
    const { addToast } = useToasts();



    const handleSignUp = (e) => {
        e.preventDefault()
        if(!isLoading){
            setLoading(true)
            setErrMsg(defaultMsg)
            userSignUp({
                email: email,
                password: password,
                password_check: passwordCheck,
                username: userName,
                phone: phone,
            }).then((res) => {
                addToast('註冊成功.', { appearance: 'success',autoDismiss:true });
                history.push("/guest/login")
            }).catch((err) => {
                addToast('註冊失敗.', { appearance: 'error',autoDismiss:true });
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
                    if (data.phone != null) {
                        msg.phone.isShow = true
                        msg.phone.msg = data.phone
                    }
                    if (data.username != null) {
                        msg.username.isShow = true
                        msg.username.msg = data.username
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
            <Form onSubmit={handleSignUp}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/guest/login">首頁</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>註冊</Breadcrumb.Item>
                </Breadcrumb>
                <Title>註冊</Title>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>電子信箱</Form.Label>
                    {errMsg.email.isShow &&
                    <Alert variant='danger'>
                        {errMsg.email.msg}
                    </Alert>
                    }
                    <Form.Control type="email" placeholder="Email" value={email}
                                  onChange={e => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的電子信箱
                    </Form.Text>

                </Form.Group>

                <Form.Group controlId="formUsername">
                    <Form.Label>使用者名稱</Form.Label>
                    {errMsg.username.isShow &&
                    <Alert variant='danger'>
                        {errMsg.username.msg}
                    </Alert>
                    }
                    <Form.Control type="text" placeholder="User Name" value={userName}
                                  onChange={e => setUserName(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的使用者名稱
                    </Form.Text>

                </Form.Group>

                <Form.Group controlId="formPhone">
                    <Form.Label>電話</Form.Label>
                    {errMsg.phone.isShow &&
                    <Alert variant='danger'>
                        {errMsg.phone.msg}
                    </Alert>
                    }
                    <Form.Control type="text" placeholder="Phone" value={phone}
                                  onChange={e => setPhone(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的電話
                    </Form.Text>

                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>密碼</Form.Label>
                    {errMsg.password.isShow &&
                    <Alert variant='danger'>
                        {errMsg.password.msg}
                    </Alert>
                    }
                    <Form.Control type="password" placeholder="Password" value={password}
                                  onChange={e => setPassword(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的密碼
                    </Form.Text>

                </Form.Group>

                <Form.Group controlId="formBasicPasswordCheck">
                    <Form.Label>確認密碼</Form.Label>
                    {errMsg.password_check.isShow &&
                    <Alert variant='danger'>
                        {errMsg.password_check.msg}
                    </Alert>
                    }
                    <Form.Control type="password" placeholder="Password" value={passwordCheck}
                                  onChange={e => setPasswordCheck(e.target.value)}/>
                    <Form.Text className="text-muted">
                        再一次輸入
                    </Form.Text>

                </Form.Group>

                <Button
                    disabled={isLoading}
                    variant="primary" type="submit">
                    {isLoading ? '...' : '註冊'}
                </Button>
            </Form>
        </FormLogin>
    )

}
