import { Breadcrumb, Button, Form, Table, Modal } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { AnnouncementList, loginLog, systemLogGetAllYear, userSignUp } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import { AnnouncementSendDelete } from "../../../lib/api";
import { useToasts } from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";
import styles from './Staff.module.scss'
import * as dayjs from 'dayjs'
//顯示表格的界面
function TableData({ data, page, loadData }) {
    const { t, i18n } = useTranslation()
    let history = useHistory();
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const { addToast } = useToasts();
    let dayjs = require("dayjs")
    //點擊查看後執行的函式
    function onInfoClick(d) {
        history.push(`/user/staff/announcement-manage/info?id=${d.id}`);
    }
    //點擊修改後執行的函式
    function onEditClick(d) {
        history.push(`/user/staff/announcement-manage/edit?id=${d.id}`);
    }
    //點擊刪除後執行的函式
    function onDeleteClick() {
        setShowDelete(false)
        setDeleteData(null)
        AnnouncementSendDelete(deleteData.id).then((res) => {
            addToast(t('announcement_delete_success'), { appearance: 'success', autoDismiss: true });
            loadData(page)
        }).catch((err) => {

        }).finally(() => {

        })
    }
    //開打點擊刪除後的視窗
    function handleOpen(d) {
        setDeleteData(d)
        setShowDelete(true)
    }
    //關閉點擊刪除後的視窗
    function handleClose() {
        setShowDelete(false)
        setDeleteData(null)
    }
    //一行資料的設定
    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.title}</StyledTd>
            
            <StyledTd>{d.user.username}</StyledTd>
            <StyledTd>{dayjs(d.created_at).format("YYYY/MM/DD")}</StyledTd>
            <StyledTd>{dayjs(d.updated_at).format("YYYY/MM/DD")}</StyledTd>
            <StyledTd>
                <Button className="mr-2" variant="info" onClick={(e) => onInfoClick(d)}>{t('check')}</Button>
                <Button className="mr-2" variant="warning" onClick={(e) => onEditClick(d)}>{t('edit')}</Button>
                <Button className="mr-2" variant="danger" onClick={(e) => handleOpen(d)}>{t('delete')}</Button>
            </StyledTd>
        </tr>
    );

    return (
        <>
            <Modal show={showDelete} onHide={handleClose}>
                <div>
                    <Modal.Header closeButton>
                        {showDelete == true &&
                            <Modal.Title>{t('delete')} {deleteData.title} ?</Modal.Title>
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
                        <tr>
                            <StyledTh>{t('id')}</StyledTh>
                            <StyledTh>{t('title')}</StyledTh>
                            <StyledTh>{t('publisher')}</StyledTh>
                            <StyledTh>{t('create_date')}</StyledTh>
                            <StyledTh>{t('edit_date')}</StyledTh>
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
//公告功能的框架
export default function Announcement() {
    let query = useQuery();
    let history = useHistory()
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])
    const { t, i18n } = useTranslation()
    //從後端取得資料
    const loadData = (page) => {
        AnnouncementList({
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
        history.replace(`/user/staff/announcement-manage?p=${page}`)
    }
    //query變化時執行裡面的程式
    useEffect(() => {
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setCurrentPage(parseInt(query.get("p")))
        } else {
            setCurrentPage(1)
        }
    }, [query])
    //currentPage變化時執行裡面的程式
    useEffect(() => {
        loadData(currentPage)
    }, [currentPage])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('announcement_setting')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('announcement_setting')}</Title>
            <div className={styles.funcItem}>
                <Link to={`/user/staff/announcement-manage/new`}><Button variant="primary">{t('new_announcement')}</Button></Link>
            </div>
            <TableData data={data} page={currentPage} loadData={loadData} />
            <div className={styles.pageItem}>
                <Pagination count={totalpage} page={currentPage} color="primary"
                    onChange={onChangePage} />
            </div>
        </div>
    )
}