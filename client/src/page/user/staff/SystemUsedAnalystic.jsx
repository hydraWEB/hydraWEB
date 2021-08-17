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
import useQuery from "../../../lib/hook";


function TableData({data}) {
    const { t, i18n } = useTranslation()
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
                    <StyledTh>{t('id')}</StyledTh>
                    <StyledTh>{t('username')}</StyledTh>
                    <StyledTh>{t('system_name')}</StyledTh>
                    <StyledTh>{t('use_time')}</StyledTh>
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
    let query = useQuery();
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const loadData = (page) => {
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
    const onChangePage = (e, page) => {
        history.replace(`/user/staff/system-used-analytics?p=${page}`)
    }

   

    useEffect(() => {
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setPage(parseInt(query.get("p")))
        } else {
            setPage(1)
        }
    }, [query])

    useEffect(() => {
        loadData(page)
    }, [page])


    return (
        <div>
            <Title>{t('system_setting')}</Title>
            <TableData data={data}/>
            <Pagination count={totalpage} page={page} variant="outlined" shape="rounded" onChange={onChangePage}/>
        </div>
    )
}