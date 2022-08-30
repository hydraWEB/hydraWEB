import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { loginLog, systemLogGetAllYear, userSignUp } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import styles from './Staff.module.scss'
import Pagination from '@material-ui/lab/Pagination';

import { css, jsx } from '@emotion/react/macro'
import { FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import useQuery from "../../../lib/hook";
import { useTranslation, Trans } from "react-i18next";

//顯示表格的界面
function TableData({ data }) {
    const { t, i18n } = useTranslation()
    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.user.username}</StyledTd>
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
                        <StyledTh>{t('login_date')}</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {idItems}
                </tbody>
            </Table>
        </StyledTable>

    )
}
//登入統計功能
export default function LoginAnalytics() {

    let history = useHistory()
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const [loading, setLoading] = useState(0)
    const [years, setYears] = useState([])
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const { t, i18n } = useTranslation()

    const [currentSelectedYearIdx, setCurrentSelectedYearIdx] = useState(0)
    const onChangeYear = (index) => {
        setCurrentSelectedYearIdx(index)
    }
    const [currentSelectedMonthIdx, setCurrentSelectedMonthIdx] = useState(0)
    const onChangeMonth = (index) => {
        setCurrentSelectedMonthIdx(index)
    }

    const listItems = years.map((year, index) =>
        <Dropdown.Item key={year.toString()} onClick={(e) => onChangeYear(index)}
            value={year}>{year.toString()}</Dropdown.Item>
    );

    const months = [t("whole_year"), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const listItems2 = months.map((month, index) =>
        <Dropdown.Item key={month.toString()} onClick={(e) => onChangeMonth(index)}
            value={month}>{month.toString()}</Dropdown.Item>
    );

    const [data, setData] = useState([])

    //衝後端取得登入資料
    const loadData = (p) => {
        let currentPage = page
        if ((typeof p !== 'undefined')) {
            currentPage = p
            setPage(p)
        }
        loginLog({
            params: {
                page: currentPage,
                type: 'user_login',
                year: years[currentSelectedYearIdx],
                month: currentSelectedMonthIdx === 0 ? null : months[currentSelectedMonthIdx]
            }
        }
        ).then((res) => {
            setData(res.data.results)
            setTotalPage(res.data.total_pages)
        }).catch((err) => {

        }).finally(() => {

        })
    }
    //初始化執行一次裡面的程式
    useEffect(() => {
        systemLogGetAllYear().then((res) => {
            setYears(res.data.data)
            setLoading(1)
        }).catch((err) => {
            setLoading(2)
        }).finally(() => {

        })
    }, [])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('login_summary')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('login_summary')}</Title>
            {loading == 0 &&
                <img
                    className={styles.loading_image}
                    src="/img/loading.svg"
                />
            }
            {loading == 1 &&
                <>
                    <div className={styles.funcItem}>
                        <span className={styles.item1}>{t('login_date')}</span>
                        <DropdownButton className={styles.item2} id="years" title={years[currentSelectedYearIdx]}>
                            {listItems}
                        </DropdownButton>
                        <span className={styles.item2}>{t('year')}</span>
                        <DropdownButton className={styles.item2} id="months" title={months[currentSelectedMonthIdx]}>
                            {listItems2}
                        </DropdownButton>
                        <span className={styles.item2}>{t('month')}</span>
                        <Button onClick={(e) => {
                            setPage(1)
                            loadData()
                        }
                        } variant="outline-primary">{t('search')}</Button>
                    </div>
                    <TableData data={data} />
                    <div className={styles.pageItem}>
                        <Pagination count={totalpage} page={page} color="primary"
                            onChange={(e, page) => {
                                loadData(page)
                            }} />
                    </div>

                </>
            }
            {loading == 2

            }
        </div>
    )
}