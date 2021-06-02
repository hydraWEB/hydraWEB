import React, {useState, useContext, Suspense} from 'react';
import {login} from '../../utils/api'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {OverlayTrigger, Tooltip, Button, Form} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {userContext} from '../../provider/UserProvider'
import userLogin from '../../lib/api'
import {useHistory} from "react-router-dom";

import styled from "@emotion/styled";
import News from "../user/News";
import Profile from "../user/Profile";
import SignUp from "./SignUp";
import Login from "./Login";
import {ToastProvider, useToasts} from 'react-toast-notifications'

export default function Guest() {
    let history = useHistory();
    const {user, setUser} = useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const Title = styled.h2(
        props => ({
                marginRight: "10px",
            }
        ))

    const handleLogin = () => {
        userLogin({
            data: {
                email: email,
                password: password
            }
        }).then((res) => {
            setUser(res.data.data)
        }).catch((err) => {

        }).finally(() => {

        })
        history.push("/user/hydramap");
    }

    return (
        <>
            <div className="">
                <ToastProvider>
                    <Switch>
                        <Route path="/guest/signup">
                            <SignUp/>
                        </Route>
                        <Route path="/guest/login">
                            <Login/>
                        </Route>
                    </Switch>
                </ToastProvider>
            </div>
        </>
    )

}
