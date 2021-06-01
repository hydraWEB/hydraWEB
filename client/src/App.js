import './App.scss';
import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Router, Switch, Route } from 'react-router-dom';

import UserProvider from './provider/UserProvider'

import Guest from './page/Guest';
import HydraMap from './page/HydraMap';
import User from './page/User';

import Cookies from 'js-cookie'

export default function App(props) {

  const initialUser = useRef()

  useEffect(()=>{
    if (Cookies.get('user_token')) {
      
    }
  },[]) 

  return (
    <>
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
    </>
  )
}