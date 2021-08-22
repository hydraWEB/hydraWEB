import {Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useState, useEffect} from "react";
import {IPList,IPSendDelete} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import useQuery from "../../../lib/hook";
import Pagination from '@material-ui/lab/Pagination';
import {FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import {useToasts} from "react-toast-notifications";

function TableData({data, loadData}) {
    const { t, i18n } = useTranslation()
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const { addToast } = useToasts();
    const [page, setPage] = useState(1);

    function onDeleteClick() {
        setShowDelete(false)
        setDeleteData(null)
        IPSendDelete(deleteData.ip_address).then((res)=>{
            addToast('刪除成功.', { appearance: 'success',autoDismiss:true });
            loadData(page)
        }).catch((err)=>{

        }).finally(()=>{

        })
    }

    function handleOpen(d) {
        setDeleteData(d)
        setShowDelete(true)
    }

    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.ip_address}</StyledTd>
            <StyledTd>
                <Button variant="danger" onClick={(e) => handleOpen(d)}>{t('delete')}</Button>
            </StyledTd>
        </tr>
    );

    return (
        <StyledTable>
            <Link to={`/user/staff/ip-manage/new`}><Button variant="primary">{t('new_ip_address')}</Button></Link>
            <Table striped bordered hover>
                <thead>
                <tr >
                    <StyledTd>{t('ip_address')}</StyledTd>
                    <StyledTh>{t('operation')}</StyledTh>
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
    let query = useQuery();
    const location = useLocation()
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const {user, setUser} = useContext(userContext)

    const loadData = (page) => {
        IPList({
            params: {
                page: page
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
        history.replace(`/user/staff/announcement-manage?p=${page}`)
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
            <Title>{t('black_list')}</Title>
            <TableData data={data}/>
            <Pagination count={totalpage} page={page} variant="outlined" shape="rounded" onChange={onChangePage}/>
        </div>
    )
}