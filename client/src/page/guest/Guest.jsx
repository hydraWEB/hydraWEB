import React, { useState, useContext, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { userContext } from '../../provider/UserProvider'
import userLogin from '../../lib/api'
import { useHistory } from "react-router-dom";

import styled from "@emotion/styled";
import Announcement from "../user/announcement/Announcement";
import Profile from "../user/profile/Profile";
import SignUp from "./SignUp";
import Login from "./Login";
import ForgotPasswd from "./ForgotPasswd";
import ResetPasswd from "./ResetPasswd";

export default function Guest() {
    let history = useHistory();
    const { user, setUser } = useContext(userContext)

    return (
        <>
            <div style={{background:'white', minHeight:"100vh"}}>
                <Switch>
                    <Route path="/guest/signup">
                        <SignUp />
                    </Route>
                    <Route path="/guest/login">
                        <Login />
                    </Route>
                    <Route path="/guest/forgot-password">
                        <ForgotPasswd />
                    </Route>
                    <Route path="/guest/reset-password">
                        <ResetPasswd />
                    </Route>
                </Switch>
            </div>
        </>
    )

}
