import {Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useState} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import Pagination from '@material-ui/lab/Pagination';
import {FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title} from "./Staff";

function TableData({data}) {
    const { t, i18n } = useTranslation()
    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.user.username}</StyledTd>
            <StyledTd>{d.operation}</StyledTd>
        </tr>
    );

    return (
        <StyledTable>
            <Table striped bordered hover>
                <thead>
                <tr >
                    <StyledTh>{t('ip_address')}</StyledTh>
                </tr>
                </thead>
                <tbody>
                {idItems}
                </tbody>
            </Table>
        </StyledTable>

    )
}

export default function IPManage() {
    const { t, i18n } = useTranslation()
    let history = useHistory()
    const location = useLocation()
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const {user, setUser} = useContext(userContext)

    return (
        <div>
            <Title>{t('black_list')}</Title>
            <TableData data={data}/>
            <Pagination count={totalpage} page={page} variant="outlined" shape="rounded" /* onChange={} *//>
        </div>
    )
}