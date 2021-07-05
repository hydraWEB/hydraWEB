import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext, useState} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { DropdownButton,Dropdown } from 'react-bootstrap';
import styles from './LoginAnalytics.module.scss'

const Title = styled.h1(
    props => ({
        fontSize:"20px",
        margin:"10px 10px 30px 10px",

    })
)


const FlexColumnContainer = styled.div(
    props => ({
        display:"flex",
    })
)

export default function LoginAnalytics() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)

    const [currentSelectedYearIdx,setCurrentSelectedYearIdx] = useState(0)
    const onChangeYear = (index) =>{
        setCurrentSelectedYearIdx(index)
    }
    const [currentSelectedMonthIdx,setCurrentSelectedMonthIdx] = useState(0)
    const onChangeMonth = (index) =>{
        setCurrentSelectedMonthIdx(index)
    }

    const years = [110,111];
    const listItems = years.map((year, index) =>
        <Dropdown.Item key={year.toString()} onClick={(e)=>onChangeYear(index)} value={year}>{year.toString()}</Dropdown.Item>
    );

    const months = ["全年度",1,2,3,4,5,6,7,8,9,10,11];
    const listItems2 = months.map((month, index) =>
        <Dropdown.Item key={month.toString()} onClick={(e)=>onChangeMonth(index)} value={month}>{month.toString()}</Dropdown.Item>
    );

    return (
        <div>
            <Title>登入統計</Title>
            <FlexColumnContainer>
                <span className={styles.item1}>登入時間</span>
                <DropdownButton className={styles.item2} id="years" title={years[currentSelectedYearIdx]}>
                    {listItems}
                </DropdownButton>
                <span className={styles.item2}>年</span>
                <DropdownButton className={styles.item2} id="months" title={months[currentSelectedMonthIdx]}>
                    {listItems2}
                </DropdownButton>
                <span className={styles.item2}>月</span>
                <Button variant="outline-primary">查詢</Button>
            </FlexColumnContainer>
        </div>
    )
}