import {Form} from "react-bootstrap";
import React, {Suspense, useContext, useState} from "react";
import {SystemSettingEdit, SystemSettingList} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import Button from '@material-ui/core/Button';


export default function SystemSetting() {
    const { t, i18n } = useTranslation()
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [currentMode, setCurrentMode] = useState(1)   // 2 = 系統更新
    

    function handleChange(){
        if(currentMode === 1){
            setCurrentMode(2)
            SystemSettingList({})
            .then((res) => {
                setCurrentMode(res.data.currentMode)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
            history.push(`/user/staff/system-updating`);
            
        }
        else{
            setCurrentMode(1)
        }
    }
    /* const submitForm = (e) => {
        let id =  query.get("id")
        accountSendEdit({
                username:username,
                phone:phone,
                password:password,
                avatar:avatar
            },id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success',autoDismiss:true });
        }).catch((err) => {

        }).finally(() => {

        })
    }

    useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            let id =  query.get("id")
            accountInfoUser({},id)
            .then((res) => {
                setUsername(res.data.username)
                setEmail(res.data.email)
                setId(res.data.id)
                setPhone(res.data.Phone)
                setAvatar(res.data.avatar)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, []) */

    return (
        <div>
            <p>{t('system_setting')}</p>
            <Button 
            variant="contained"
            onClick={handleChange}
            >
                {t('change')}
            </Button>
        </div>
    )
}