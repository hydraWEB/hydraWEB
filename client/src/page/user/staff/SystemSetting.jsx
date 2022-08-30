import React, {Suspense, useContext, useState, useEffect} from "react";
import {SystemSettingEdit, SystemSettingList} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import {useToasts} from "react-toast-notifications";
import useQuery from "../../../lib/hook";
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import {  Title } from "./Staff";
//沒用到
export default function SystemSetting() {
    
    const { t, i18n } = useTranslation()
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [currentMode, setCurrentMode] = useState()   // 2 = 系統更新
    let query = useQuery();
    const { addToast } = useToasts();

    function handleChange(){
        let nextMode = 0
        let id =  1
        if(currentMode === 1){
            nextMode = 2
        }
        else{
            nextMode = 1
        }
        setCurrentMode(nextMode)
        SystemSettingEdit({
                currentMode:nextMode
            },id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success',autoDismiss:true });
        }).catch((err) => {

        }).finally(() => {

        })
    }


    useEffect(() => {
        SystemSettingList({})
            .then((res) => {
                setCurrentMode(res.data.results[0].currentMode)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
    
    }, [])

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('system_setting')}</Breadcrumb.Item>
            </Breadcrumb>
            <Title>{t('system_setting')}</Title>
            <Button 
            variant="contained"
            onClick={handleChange}
            >
                {t('change')}
            </Button>
        </div>
    )
}