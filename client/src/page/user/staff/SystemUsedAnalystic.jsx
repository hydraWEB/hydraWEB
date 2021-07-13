import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {useTranslation} from "react-i18next";

const Title = styled.h1(
    props => ({
        fontSize:"20px",
        margin:"10px 10px 30px 10px",

    })
)

export default function SystemUsedAnalytics() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const { t, i18n } = useTranslation();

    return (
        <div>
            <Title>{t('system_setting')}</Title>
        </div>
    )
}