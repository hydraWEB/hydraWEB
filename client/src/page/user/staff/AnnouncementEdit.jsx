import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {AnnouncementInfoUser} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import {StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";

export default function AnnouncementNew() {
    let query = useQuery();
    let history = useHistory()

    const [title,setTitle] = useState("")
    const [content,setContent] = useState("")

    const submitForm = (e) => {
        AnnouncementSendNew({
                title:title,
                content:content
            }
        ).then((res) => {
            history.push(`/user/staff/announcement-manage`)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            AnnouncementInfoUser({},id)
            .then((res) => {
                setTitle(res.data.title)
                setContent(res.data.content)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, [query])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/announcement-manage">公告管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>修改公告</Breadcrumb.Item>
            </Breadcrumb>
            <Title>修改公告</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>標題</Form.Label>
                    <Form.Control type="text" placeholder="" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>內容</Form.Label>
                    <Form.Control as="textarea" rows={3}  value={content} onChange={(e)=>setContent(e.target.value)}  />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>送出</Button>

        </div>
    )
}