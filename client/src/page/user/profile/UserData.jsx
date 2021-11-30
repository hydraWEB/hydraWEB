import { Breadcrumb, Button, Form, Table, Modal } from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {userForgotPasswdCheckToken, userProfile, userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {useToasts} from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";
import styles from "./Profile.module.scss"

export default function UserData() {
    const { t, i18n } = useTranslation()
    let defaultData = {
        userid: "",
        username: "",
        email: "",
        avatar: "",
        phone: "",
    }


    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [isLoading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState(defaultData)
    const { addToast } = useToasts();

    useEffect(() => {
        userProfile().then((res) => {
            setIsLoaded(true)
            console.log(res.data)
            setData(res.data.data.user)
        }).catch((err) => {
            setIsError(true)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const handleLogout = (e) => {
        addToast(t("logout_success"), { appearance: 'success',autoDismiss:true });
        Cookies.remove('access')
        setUser(null)
        history.push('/guest/login')
    }

    const Title = styled.span(
        props => ({
                marginRight: "10px",
            }
        ))
    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('user_profile')}</Breadcrumb.Item>
            </Breadcrumb>
            <p className={styles.page_title}>{t('user_profile')}</p>
            { !isLoading &&
                <>  {
                    isLoaded && <div>
                        <p>{t('id')}: {data.userid}</p>
                        <p>{t('name')}: {data.username}</p>
                        <p>{t('email')}: {data.email}</p>
                        <p>{t('phone')}: {data.phone}</p>
                    </div>
                }

                </>
            }
            <Button
                onClick={handleLogout}
                variant="primary" type="submit">
                {t('logout')}
            </Button>
        </div>
    )
}