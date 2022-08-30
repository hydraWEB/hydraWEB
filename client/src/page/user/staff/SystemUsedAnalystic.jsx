import React, { Suspense, useContext, useEffect, useState } from "react";
import { loginLog, systemLogGetAllYear, userSignUp } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from '@material-ui/lab/Pagination';
import useQuery from "../../../lib/hook";
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import styles from './Staff.module.scss'

//顯示表格的界面
function TableData({ data }) {
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
//系統功能使用記錄功能
export default function SystemUsedAnalytics() {
    let history = useHistory()
    let query = useQuery();
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    //從後端取得資料
    const loadData = (page) => {
        loginLog({
            params: {
                page: page,
                lang: i18n.language,
            }
        }
        ).then((res) => {
            setData(res.data.results)
            setTotalPage(res.data.total_pages)
        }).catch((err) => {

        }).finally(() => {

        })
    }
    //頁面變化時執行的函式
    const onChangePage = (e, page) => {
        history.replace(`/user/staff/system-used-analytics?p=${page}`)
    }


    //query變化時執行裡面的函式
    useEffect(() => {
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setPage(parseInt(query.get("p")))
        } else {
            setPage(1)
        }
    }, [query])
    //page變化時執行裡面的函式
    useEffect(() => {
        loadData(page)
    }, [page])


    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('system_function_usage')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('system_function_usage')}</Title>
            <TableData data={data} />
            <div className={styles.pageItem}>
                <Pagination count={totalpage} page={page} onChange={onChangePage} color="primary" />
            </div>

        </div>
    )
}