import { Breadcrumb, Button, Form, Table, Modal } from "react-bootstrap";
import React, { Suspense, useContext, useState, useEffect } from "react";
import { IPList, IPSendDelete } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import useQuery from "../../../lib/hook";
import Pagination from '@material-ui/lab/Pagination';
import { FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import { useToasts } from "react-toast-notifications";
import styles from './Staff.module.scss'
//顯示表格的界面
function TableData({ data, page, loadData }) {
    const { t, i18n } = useTranslation()
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const { addToast } = useToasts();
    //點擊刪除按鈕後執行的函式
    function onDeleteClick() {
        setShowDelete(false)
        setDeleteData(null)
        IPSendDelete(deleteData.id).then((res) => {
            addToast(t("ip_delete_success"), { appearance: 'success', autoDismiss: true });
            loadData(page)
        }).catch((err) => {
            addToast(t("error"), { appearance: 'error', autoDismiss: true });
        }).finally(() => {

        })
    }
    //控制打開點擊刪除按鈕後打開的視窗
    function handleOpen(d) {
        setDeleteData(d)
        setShowDelete(true)
    }
    //控制關閉點擊刪除按鈕後打開的視窗
    function handleClose() {
        setShowDelete(false)
        setDeleteData(null)
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
        <>
            <Modal show={showDelete} onHide={handleClose}>
                <div>
                    <Modal.Header closeButton>
                        {showDelete == true &&
                            <Modal.Title>{t('delete')} {deleteData.ip_address} ?</Modal.Title>
                        }
                    </Modal.Header>
                    <Modal.Body>{t('are_you_sure_you_want_to_delete?')}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {t('close')}
                        </Button>
                        <Button variant="danger" onClick={onDeleteClick}>
                            {t('delete')}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
            <StyledTable>
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
        </>
    )
}
//ip管理功能
export default function IPManage() {
    const { t, i18n } = useTranslation()
    let history = useHistory()
    let query = useQuery();
    const location = useLocation()
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const { user, setUser } = useContext(userContext)
    //衝後端取得資料
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
    //頁面變化時執行的函式
    const onChangePage = (e, page) => {
        history.replace(`/user/staff/ip-manage?p=${page}`)
    }
    //每當query變化時執行裡面的程式
    useEffect(() => {
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setPage(parseInt(query.get("p")))
        } else {
            setPage(1)
        }
    }, [query])
    //每當page變化時執行裡面的程式
    useEffect(() => {
        loadData(page)
    }, [page])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('ip_manage')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('ip_manage')}</Title>
            <div className={styles.funcItem}>
                <Link to={`/user/staff/ip-manage/new`}><Button variant="primary">{t('new_ip_address')}</Button></Link>
            </div>
            <TableData data={data} page={page} loadData={loadData} />
            <div className={styles.pageItem}>
                <Pagination count={totalpage} page={page} onChange={onChangePage} color="primary" />

            </div>
        </div>
    )
}