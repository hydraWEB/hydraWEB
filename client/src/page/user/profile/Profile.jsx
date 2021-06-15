import {Button, Form} from "react-bootstrap";
import React, {useContext} from "react";
import {userSignUp} from "../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../provider/UserProvider";
import {useHistory} from "react-router-dom";

export default function Profile() {
    let history = useHistory()
    const {user, setUser} = useContext(userContext)
    const handleLogout = (e) => {
        Cookies.remove('access')
        setUser(null)
        history.push('/guest/login')
    }

    return (
        <div>
            <h1>使用者資料</h1>
            <Button
                onClick={handleLogout}
                variant="primary" type="submit">
                登出
            </Button>
        </div>
    )
}