import React, {Suspense, useContext, useEffect, useState} from "react";
import {loginLog, systemLogGetAllYear, userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {useTranslation} from "react-i18next";
import {FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import {Button, Form, Table} from "react-bootstrap";
import Pagination from '@material-ui/lab/Pagination';


function TableData({data}) {

    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.user.username}</StyledTd>
            <StyledTd>{d.operation}</StyledTd>
            <StyledTd>{d.created_at}</StyledTd>
        </tr>
    );

    return (
        <StyledTable>
            <Table striped bordered hover>
                <thead>
                <tr >
                    <StyledTh>id</StyledTh>
                    <StyledTh>username</StyledTh>
                    <StyledTh>系統名稱</StyledTh>
                    <StyledTh>使用時間</StyledTh>
                </tr>
                </thead>
                <tbody>
                {idItems}
                </tbody>
            </Table>
        </StyledTable>

    )
}

export default function SystemUsedAnalytics() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const loadData = () => {
        loginLog({
                params: {
                    page: page,
                }
            }
        ).then((res) => {
            setData(res.data.results)
            setTotalPage(res.data.total_pages)
        }).catch((err) => {

        }).finally(() => {

        })
    }
    useEffect(() => {
        loadData()
    }, [])

    return (
        <div>
            <Title>{t('system_setting')}</Title>
            <TableData data={data}/>
            <Pagination count={totalpage} page={page} variant="outlined" shape="rounded"
                            onChange={loadData}/>
        </div>
    )
}