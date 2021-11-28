import { Breadcrumb, Button, Form, Table, Modal } from "react-bootstrap";
import React, { Suspense, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { userSignUp, accountList, accountSendNew, accountSendEdit, accountSendDelete } from "../../../lib/api";
import { useTranslation } from "react-i18next";
import { FlexColumnContainer, StyledTable, StyledTd, StyledTh, Title } from "./Staff";
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from "react-toast-notifications";
import styles from './Staff.module.scss'
import * as dayjs from 'dayjs'

function TableData({ data, loadData }) {
    const { t, i18n } = useTranslation();
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const { addToast } = useToasts();
    const [page, setPage] = useState(1);
    let history = useHistory();
    let dayjs = require("dayjs")
    function onInfoClick(d) {
        history.push(`/user/staff/account-manage/info?id=${d.userid}`);
    }

    function onEditClick(d) {
        history.push(`/user/staff/account-manage/edit?id=${d.userid}`);
    }

    function onChangePasswordClick(d){
        history.push(`/user/staff/account-manage/changePassword?id=${d.userid}`);
    }

    function onDeleteClick() {
        setShowDelete(false)
        setDeleteData(null)
        accountSendDelete(deleteData.userid).then((res) => {
            addToast('刪除成功.', { appearance: 'success', autoDismiss: true });
            loadData(page)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    function handleOpen(d) {
        setDeleteData(d)
        setShowDelete(true)
    }

    function handleClose() {
        setShowDelete(false)
        setDeleteData(null)
    }

    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.userid}</StyledTd>
            <StyledTd>{d.username}</StyledTd>
            <StyledTd>{dayjs(d.created_at).format("YYYY/MM/DD")}</StyledTd>
            <StyledTd>
                <Button className="mr-2" variant="info" onClick={(e) => onInfoClick(d)}>{t('check')}</Button>
                <Button className="mr-2" variant="warning" onClick={(e) => onEditClick(d)}>{t('edit')}</Button>
                <Button className="mr-2" variant="warning" onClick={(e) => onChangePasswordClick(d)}>{t('change_password')}</Button>
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
                            <Modal.Title>{t('delete')} {deleteData.username} ?</Modal.Title>
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
                            <StyledTh>{t('id')}</StyledTh>
                            <StyledTh>{t("username")}</StyledTh>
                            <StyledTh>{t("register_date")}</StyledTh>
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

export default function AccountManage() {
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])

    const loadData = () => {
        accountList({
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
            <Breadcrumb>
                <Breadcrumb.Item active>{t('account_manage')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('account_manage')}</Title>
            <TableData data={data} loadData={loadData} />
            <div className={styles.pageItem}>
            <Pagination count={totalpage} page={page} color="primary"
                onChange={loadData} />
            </div>
        </div>
    )
}