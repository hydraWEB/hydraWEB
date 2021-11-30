import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { IPSendNew } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import { useToasts } from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";

export default function AnnouncementEdit() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();
    const [ipAddress, setIpAddress] = useState([])

    const submitForm = (e) => {
        IPSendNew({
            ip_address: ipAddress,
        }
        ).then((res) => {
            addToast(t("ip_create_success"), { appearance: 'success', autoDismiss: true });
            history.push(`/user/staff/ip-manage`)
        }).catch((err) => {
            addToast(t("error"), { appearance: 'error', autoDismiss: true });
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
            <Breadcrumb>
                <Breadcrumb.Item ><Link to="/user/staff/ip-manage">{t('ip_manage')}</Link></Breadcrumb.Item>
                <Breadcrumb.Item active>{t('new_ip_address')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('new_ip_address')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('ip_address')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e) => submitForm(e)}>{t('confirm')}</Button>
        </div>
    )
}