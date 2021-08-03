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
import {AnnouncementSendDelete} from "../../../lib/api";
import {useToasts} from "react-toast-notifications";

function TableData({ data,page,loadData }) {
    let history = useHistory();
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const { addToast } = useToasts();

    function onInfoClick(d) {
        history.push(`/user/staff/announcement-manage/info?id=${d.id}`);
    }

    function onEditClick(d) {
        history.push(`/user/staff/announcement-manage/edit?id=${d.id}`);
    }

    function onDeleteClick() {
        setShowDelete(false)
        setDeleteData(null)
        AnnouncementSendDelete(deleteData.id).then((res)=>{
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

    function handleClose() {
        setShowDelete(false)
        setDeleteData(null)
    }

    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.title}</StyledTd>
            <StyledTd>{d.user.username}</StyledTd>
            <StyledTd>{d.created_at}</StyledTd>
            <StyledTd>{d.updated_at}</StyledTd>
            <StyledTd>
                <Button variant="info" onClick={(e) => onInfoClick(d)}>查看</Button>
                <Button variant="warning" onClick={(e) => onEditClick(d)}>修改</Button>
                <Button variant="danger" onClick={(e) => handleOpen(d)}>刪除</Button>
            </StyledTd>
        </tr>
    );

    return (
        <>
            <Modal show={showDelete} onHide={handleClose}>
                <div>
                    <Modal.Header closeButton>
                        {showDelete == true &&
                            <Modal.Title>刪除 {deleteData.title} ?</Modal.Title>
                        }
                    </Modal.Header>
                    <Modal.Body>確定要刪除？</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            關閉
                        </Button>
                        <Button variant="danger" onClick={onDeleteClick}>
                            刪除
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            <StyledTable>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <StyledTh>id</StyledTh>
                            <StyledTh>標題</StyledTh>
                            <StyledTh>發布者</StyledTh>
                            <StyledTh>創建日期</StyledTh>
                            <StyledTh>修改日期</StyledTh>
                            <StyledTh>操作</StyledTh>
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

export default function Announcement() {
    let query = useQuery();
    let history = useHistory()
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)
    const [data, setData] = useState([])

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

    const onChangePage = (e, page) => {
        history.replace(`/user/staff/announcement-manage?p=${page}`)
    }

    useEffect(() => {
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setCurrentPage(parseInt(query.get("p")))
        } else {
            setCurrentPage(1)
        }
    }, [query])

    useEffect(() => {
        loadData(currentPage)
    }, [currentPage])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>公告管理</Breadcrumb.Item>
            </Breadcrumb>
            <Title>公告管理</Title>
            <Link to={`/user/staff/announcement-manage/new`}><Button variant="primary">新增公告</Button></Link>
            <TableData data={data} page={currentPage} loadData={loadData} />
            <Pagination count={totalpage} page={currentPage} variant="outlined" shape="rounded"
                onChange={onChangePage} />
        </div>
    )
}