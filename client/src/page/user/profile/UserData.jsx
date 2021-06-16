import {Button, Form, ListGroup} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {userForgotPasswdCheckToken, userProfile, userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";

export default function UserData() {

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
            <p>使用者資料</p>
            { !isLoading &&
                <>  {
                    isLoaded && <div>
                        <p>id: {data.userid}</p>
                        <p>name: {data.username}</p>
                        <p>email: {data.email}</p>
                        <p>phone: {data.phone}</p>
                    </div>
                }

                </>
            }
            <Button
                onClick={handleLogout}
                variant="primary" type="submit">
                登出
            </Button>
        </div>
    )
}