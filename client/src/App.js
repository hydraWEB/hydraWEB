import './App.scss';
import React, {useContext, useEffect, useRef} from 'react';
import {BrowserRouter, Router, Switch, Route, useLocation, useHistory} from 'react-router-dom';

import UserProvider, {userContext} from './provider/UserProvider'

import Guest from './page/guest/Guest';
import HydraMap from './page/user/HydraMap';
import User from './page/user/User';

import Cookies from 'js-cookie'

export default function App(props) {

    const initialUser = useRef()
    let history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if(location.pathname ==="/"){
            if(Cookies.get('access')){
                history.push("/user/hydramap")
            }else{
                history.push("/guest/login")
            }
        }else{
            let urlElements = location.pathname.split('/')
            if(urlElements[1]==='guest'){
                if(Cookies.get('access')){
                    history.push("/user/hydramap") //已登入的使用者不能到guest
                }
            }else if(urlElements[1]==='user'){
                if(!Cookies.get('access')){
                    history.push("/guest/login") //沒登入的使用者不能到user
                }
            }
        }
    }, [])

    return (
        <>
            <div className={'root-container'}>
                <UserProvider initialUser={initialUser}>
                    <Switch>
                        <Route path="/user">
                            <User/>
                        </Route>
                        <Route path="/guest">
                            <Guest/>
                        </Route>
                        <Route path="/">
                            <Guest/>
                        </Route>
                    </Switch>
                </UserProvider>
            </div>
        </>
    )
}