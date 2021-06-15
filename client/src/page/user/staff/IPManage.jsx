import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";

export default function IPManage() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)

    return (
        <div>
            <p>IP管理</p>
        </div>
    )
}