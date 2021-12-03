import React, { useState, useContext, useRef } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button, Form, Alert, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { userContext } from '../../provider/UserProvider'
import userLogin from '../../lib/api'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'
import styles from './Login.module.scss';
import styled from "@emotion/styled";
import { useToasts } from "react-toast-notifications";
import { userRequest_client } from '../../lib/api'
import { useTranslation, Trans } from "react-i18next";

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
    const { t, i18n } = useTranslation();
    const { user, setUser } = useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [showWarning, setShowWarning] = useState(false)
    const { addToast } = useToasts();
    const initialUser = useRef()

    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
        Cookies.set('locale', lng)
    };

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
                    addToast(t('login_success'), { appearance: 'success', autoDismiss: true });
                    Cookies.set('access', res.data['access'])
                    userRequest_client.defaults.headers.common['Authorization'] = `Bearer ${res.data['access']}`
                    initialUser.current = res.data
                    setUser(initialUser)
                    history.push("/user/hydramap")
                }
            }).catch((err) => {
                addToast(t('login_fail'), { appearance: 'error', autoDismiss: true });
                setText(t('login_fail'))
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
                        <div className={styles.formLogin_left}>
                            <img src="/img/login_display.jpg"/>
                        </div>
                        <div className={styles.formLogin_right}>
                        <Form onSubmit={handleLogin}>
                            <div className="d-flex">
                                <img src='/logo.png' className={styles.title_img} />
                                <Title>{t('platform_name')}</Title>
                            </div>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Email" value={email}
                                    onChange={e => setEmail(e.target.value)} />
                                <Form.Text className="text-muted">
                                    {t("your_email")}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password}
                                    onChange={e => setPassword(e.target.value)} />
                                <Form.Text className="text-muted">
                                    {t("your_password")}
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
                                    {isLoading ? '...' : t("login")}
                                </Button>
                                <LinkText className ={styles.texts}><Link
                                    to={{
                                        pathname: "/guest/signup",
                                    }}
                                >{t("sign_up")}</Link></LinkText>
                                <LinkText className ={styles.texts}><Link
                                    to={{
                                        pathname: "/guest/forgot-password",
                                    }}
                                >{t("forgot_your_password")}</Link></LinkText>
                                <NavDropdown className={styles.link} title={t("language")} id="nav-dropdown">
                                    <NavDropdown.Item eventKey="4.1" onClick={(e) => changeLanguage("en")}>English</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.2" onClick={(e) => changeLanguage("zh_tw")}>繁體中文</NavDropdown.Item>
                                </NavDropdown>
                            </FlexContainer>


                        </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
