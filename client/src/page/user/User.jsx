import React, {Suspense, useContext, useEffect, useRef} from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import styles from './User.module.scss';
import Home from './Home';
import Profile from './profile/Profile';
import News from './news/News';
import {userContext} from "../../provider/UserProvider";
import Staff from "./staff/Staff";
import Cookies from "js-cookie";
import {userProfile} from "../../lib/api";
const HydraMap = React.lazy(() => import('./HydraMap'));

export default function User(props) {
    const {user, setUser} = useContext(userContext)
    const initialUser = useRef()

    useEffect(() => {
        console.log(user)
    },[user])

    useEffect(() => {
        if(Cookies.get('access')){
            userProfile().then((res) => {
                initialUser.current = res.data.data.user
                setUser(initialUser)
            }).catch((err) => {
            }).finally(() => {
            })
        }

    }, [])

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="" variant="dark" className={styles.navbar}>
                <Navbar.Brand><Link to="/user/hydramap" className={styles.link}>水文與下陷監測巨量資料運算平台</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">

                    </Nav>
                    <Nav>
                        <Nav.Link><Link to="/user/news" className={styles.link}>公告</Link></Nav.Link>
                        { typeof user.current != 'undefined' &&
                            <>
                                { user.current.is_staff &&
                                <Nav.Link><Link to="/user/staff/login-analytics" className={styles.link}>管理員</Link></Nav.Link>
                                }
                            </>
                        }

                        <Nav.Link><Link to="/user/profile/userdata"  className={styles.link}>個人帳號</Link></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className={styles.user_container}>
                <Switch>
                    <Route path="/user/news">
                        <News />
                    </Route>
                    <Route path="/user/profile">
                        <Profile />
                    </Route>
                    <Route path="/user/staff">
                        <Staff />
                    </Route>
                    <Route path="/user/hydramap">
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <HydraMap />
                        </Suspense>
                    </Route>
                </Switch>
            </div>
        </>
    )
}