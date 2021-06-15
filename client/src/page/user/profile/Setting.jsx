import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";

export default function Setting() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)


    const Title = styled.span(
        props => ({
                marginRight: "10px",
            }
        ))
    return (
        <div>
            <p>設定</p>
        </div>
    )
}