import React, { useState, useContext, useRef } from 'react';
import { login } from '../../utils/api'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button, Form, Alert } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { userContext } from '../../provider/UserProvider'
import userLogin from '../../lib/api'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'

import styles from './Login.module.scss';
import styled from "@emotion/styled";
import { useToasts } from "react-toast-notifications";
import { userRequest_client } from '../../lib/api'

const Title = styled.h2(
    props => ({
        marginRight: "10px",
        fontSize: "30px",
        marginBottom: "20px"
    }
    ))

const FlexContainer = styled.div(
    props => ({
        display: "flex",
    }
    ))

const LinkText = styled.span(
    props => ({
        paddingTop: "5px",
        marginLeft: "20px",
        fontSize: "19px"
    }
    ))

const Container = styled.div(
    props => ({
        height: "100vh",
        position: "relative",
    })
)

const FormLogin = styled.div(
    props => ({
        margin: "0 auto",
        paddingTop: "50px",
        paddingBottom: "50px",
        paddingLeft: "50px",
        paddingRight: "50px",
        background: "#FAFAFA",
        borderRadius: "10px",
        maxWidth: "800px",
        position: "absolute",
        top: "50%",
        left: "50%"
    })
)


export default function Login() {
    let history = useHistory()
    const { user, setUser } = useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [showWarning, setShowWarning] = useState(false)
    const { addToast } = useToasts();
    const initialUser = useRef()
    const handleLogin = (e) => {
        //history.push("/user/hydramap")
        e.preventDefault()
        if (!isLoading) {
            setShowWarning(false)
            userLogin({
                email: email,
                password: password
            }).then((res) => {
                if (res.status === 200) {
                    addToast('登入成功.', { appearance: 'success', autoDismiss: true });
                    Cookies.set('access', res.data['access'])
                    userRequest_client.defaults.headers.common['Authorization'] = `Bearer ${res.data['access']}`
                    initialUser.current = res.data
                    setUser(initialUser)
                    history.push("/user/hydramap")
                }
            }).catch((err) => {
                setText("帳號或密碼錯誤！")
                setShowWarning(true)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <>

            <div className={styles.container}>
                <div className={styles.formConatainer} >
                    <div className={styles.formLogin}>
                        <Form onSubmit={handleLogin}>
                            <Title>濁水溪沖積扇水文與地層下陷監測展示平台</Title>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Email" value={email}
                                    onChange={e => setEmail(e.target.value)} />
                                <Form.Text className="text-muted">
                                    您的電子信箱
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password}
                                    onChange={e => setPassword(e.target.value)} />
                                <Form.Text className="text-muted">
                                    您的密碼
                                </Form.Text>
                            </Form.Group>

                            {showWarning &&
                                <Alert variant='danger'>
                                    {text}
                                </Alert>
                            }


                            <FlexContainer>
                                <Button
                                    disabled={isLoading}
                                    variant="primary" type="submit">
                                    {isLoading ? '...' : '登入'}
                                </Button>
                                <LinkText><Link
                                    to={{
                                        pathname: "/guest/signup",
                                    }}
                                >註冊</Link></LinkText>
                                <LinkText><Link
                                    to={{
                                        pathname: "/guest/forgot-password",
                                    }}
                                >忘記密碼</Link></LinkText>
                            </FlexContainer>


                        </Form>
                    </div>
                </div>
            </div>
        </>
    )

}
