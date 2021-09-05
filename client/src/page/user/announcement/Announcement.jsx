import { Button, Form } from "react-bootstrap";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { AnnouncementInfoUser, AnnouncementList, AnnouncementListUser, userSignUp } from "../../../lib/api";
import Cookies from 'js-cookie'
import { userContext } from "../../../provider/UserProvider";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styles from "./Announcement.module.scss";
import styled from "@emotion/styled";
import NormalButton from "../../../component/NormalButton";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import useQuery from "../../../lib/hook";
import { StyledTd } from "../staff/Staff";
import Pagination from "@material-ui/lab/Pagination";

const StyledPaginationWrapper = styled.div(
    props => (
        {
            marginTop: '15px',
            marginBottom: '15px'
        }
    ))

export default function Announcement() {
    let history = useHistory()
    const location = useLocation()
    const { user, setUser } = useContext(userContext)
    const { t, i18n } = useTranslation();
    let query = useQuery();

    const [loading, setLoading] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentID, setCurrentID] = useState(null)
    const [totalpage, setTotalPage] = useState(0)
    const [pageListData, setPageListData] = useState([])
    const [infoData, setInfoData] = useState([])

    const loadData = (page) => {
        AnnouncementListUser({
            params: {
                page: page
            }
        }
        ).then((res) => {
            setPageListData(res.data.results)
            setTotalPage(res.data.total_pages)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    const loadExData = (id) => {
        AnnouncementInfoUser({}, id
        ).then((res) => {
            setInfoData(res.data)
        }).catch((err) => {

        }).finally(() => {

        })
    }

    const onChangePage = (e, page) => {
        if (currentID != null) {
            history.replace(`/user/announcement?p=${page}&id=${currentID}`)
        } else {
            history.replace(`/user/announcement?p=${page}`)
        }
    }

    const onChangeID = (e, id) => {
        history.replace(`/user/announcement?p=${currentPage}&id=${id}`)
    }

    useEffect(() => {
        let test = query.get("p")
        let test2 = query.get("id")
        if (typeof query.get("p") !== 'undefined' && query.get("p") != null) {
            setCurrentPage(parseInt(query.get("p")))
        } else {
            setCurrentPage(1)
        }
        if (typeof query.get("id") !== 'undefined' && query.get("id") != null) {
            setCurrentID(parseInt(query.get("id")))
        }
    }, [query])

    useEffect(() => {
        loadData(currentPage)
    }, [currentPage])

    useEffect(() => {
        loadExData(currentID)
    }, [currentID])

    const items = pageListData.map((d, index) =>
        <tr>
            <NormalButton onClick={(e) => onChangeID(e, d.id)} isLightOn={currentID == d.id} text={d.title} icon={faUser} />
        </tr>
    );

    return (
        <div className={styles.wrapper} >
            <div className={styles.menu_desk} >
                <div className={styles.menu_desk_container} >
                    <span className={styles.title}>{t('announcement')}</span>
                    <StyledPaginationWrapper>
                        <Pagination count={totalpage} page={currentPage} variant="outlined" shape="rounded"
                            onChange={onChangePage} />
                    </StyledPaginationWrapper>
                    {items}
                </div>
            </div>
            <div className={styles.profile_container} >
                <p className={styles.annoTitle}>{infoData.title}</p>
                <div
                    dangerouslySetInnerHTML={{
                        __html: infoData.content
                    }}></div>
            </div>
        </div>
    )
}