import './App.scss';
import React, { useContext, useEffect, useRef } from 'react';
import { BrowserRouter, Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';

import UserProvider, { userContext } from './provider/UserProvider'

import Guest from './page/guest/Guest';
import HydraMap from './page/user/HydraMap';
import User from './page/user/User';

import Cookies from 'js-cookie'
import { userProfile, userRequest_client } from "./lib/api";
import { useTranslation, Trans } from "react-i18next";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { ToastProvider, useToasts } from 'react-toast-notifications'

export default function App(props) {

    const initialUser = useRef()
    let history = useHistory();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    if (Cookies.get('access')) {
        userRequest_client.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('access')}`
    }


    useEffect(() => {

        if (Cookies.get('locale')) {
            i18n.changeLanguage(Cookies.get('locale'));
        }
        if (location.pathname === "/") {
            if (Cookies.get('access')) {
                history.push("/user/hydramap")
            } else {
                history.push("/guest/login")
            }
        } else {
            let urlElements = location.pathname.split('/')
            if (urlElements[1] === 'guest') {
                if (Cookies.get('access')) {
                    history.push("/user/hydramap") //已登入的使用者不能到guest
                }
            } else if (urlElements[1] === 'user') {
                if (!Cookies.get('access')) {
                    history.push("/guest/login") //沒登入的使用者不能到user
                }
            }
        }
    }, [])


    const darkTheme = createTheme({
        palette: {
            type: 'dark',
        },
    });

    return (
        <>
            <ToastProvider placement={"bottom-right"}>

                <ThemeProvider theme={darkTheme}>
                    <div className={'root-container'}>
                        <UserProvider initialUser={initialUser}>
                            <Switch>
                                <Route path="/user">
                                    <User />
                                </Route>
                                <Route path="/guest">
                                    <Guest />
                                </Route>
                                <Route path="/">
                                    <Guest />
                                </Route>
                            </Switch>
                        </UserProvider>
                    </div>
                </ThemeProvider>
            </ToastProvider>

        </>
    )
}