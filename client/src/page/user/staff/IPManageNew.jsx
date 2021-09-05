import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {IPSendNew} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import {StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import {useToasts} from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";

export default function AnnouncementEdit() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();
    const [ipAddress, setIpAddress] = useState([])

    const submitForm = (e) => {
        IPSendNew({
                ip_address:ipAddress,
            }
        ).then((res) => {
            addToast('新增成功.', { appearance: 'success',autoDismiss:true });
            history.push(`/user/staff/ip-manage`)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    /* useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            let id =  query.get("id")
            accountInfoUser({},id)
            .then((res) => {
                setIpAddress(res.data.ipAddress)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, []) */

    return (
        <div>
            <Title>{t('ip_setting')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('ip_address')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={ipAddress} onChange={(e)=>setIpAddress(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>{t('confirm')}</Button>
        </div>
    )
}