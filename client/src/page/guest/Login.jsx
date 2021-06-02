import React, {useState, useContext} from 'react';
import {login} from '../../utils/api'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {OverlayTrigger, Tooltip, Button, Form, Alert} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {userContext} from '../../provider/UserProvider'
import userLogin from '../../lib/api'
import {useHistory} from "react-router-dom";
import Cookies from 'js-cookie'

import './Login.scss';
import styled from "@emotion/styled";

export default function Login() {
    let history = useHistory()
    const {user, setUser} = useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [showWarning, setShowWarning] = useState(false)

    const Title = styled.h2(
        props => ({
                marginRight: "10px",
                fontSize: "40px",
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
                marginLeft: "20px",
                fontSize: "19px"
            }
        ))

    const handleLogin = (e) => {
        e.preventDefault()
        if (!isLoading) {
            setShowWarning(false)
            userLogin({
                email: email,
                password: password
            }).then((res) => {
                if (res.status === 200) {
                    Cookies.set('access', res.data['access'])
                    setUser(res.data)
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
            <Form className="form1" onSubmit={handleLogin}>
                <Title>HydraWeb</Title>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email}
                                  onChange={e => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                        您的電子信箱
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password}
                                  onChange={e => setPassword(e.target.value)}/>
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
                    <Link
                        to={{
                            pathname: "/guest/signup",
                        }}
                    ><LinkText>註冊</LinkText></Link>
                </FlexContainer>


            </Form>
        </>
    )

}
