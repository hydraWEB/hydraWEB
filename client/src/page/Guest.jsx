import React, { useState,useContext } from 'react';
import { login } from '../utils/api'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { userContext } from '../provider/UserProvider'
import userLogin from '../lib/api'
import { useHistory } from "react-router-dom";

import './Guest.scss';

export default function Guest() {
    let history = useHistory();
    const { user, setUser } = useContext(userContext)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleLogin = () => {
        userLogin({
            data: {
                email: email,
                password: password
            }
        }).then((res)=>{
          setUser(res.data.data)
        }).catch((err)=>{
    
        }).finally(()=>{
          
        })
        history.push("/user/hydramap");
    }
    
    return (
        <>
            <Form className="form" onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    )

}
