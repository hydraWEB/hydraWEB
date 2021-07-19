import React, { Suspense, useContext, useEffect, useRef } from 'react';
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
import Announcement from './announcement/Announcement';
import { userContext } from "../../provider/UserProvider";
import Staff from "./staff/Staff";
import Cookies from "js-cookie";
import { userProfile } from "../../lib/api";
import { useTranslation, Trans } from "react-i18next";

const HydraMap = React.lazy(() => import('./HydraMap'));

export default function User(props) {
    const { user, setUser } = useContext(userContext)
    const initialUser = useRef()

    const { t, i18n } = useTranslation();
    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
        Cookies.set('locale', lng)
    };

    useEffect(() => {
        console.log(user)
    }, [user])

    useEffect(() => {
        if (Cookies.get('access')) {
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
                <Navbar.Brand><Link to="/user/hydramap" className={styles.link}>{t('platform_name')}</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">

                    </Nav>
                    <Nav>
                        <Nav.Link><Link to="/user/announcement" className={styles.link}>{t("announcement")}</Link></Nav.Link>
                        {typeof user.current != 'undefined' &&
                            <>
                                {user.current.is_staff &&
                                    <Nav.Link><Link to="/user/staff/login-analytics" className={styles.link}>{t("admin")}</Link></Nav.Link>
                                }
                            </>
                        }

                        <Nav.Link><Link to="/user/profile/userdata" className={styles.link}>{t("account")}</Link></Nav.Link>
                        <NavDropdown title={t("language")} id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.1" onClick={(e)=> changeLanguage("en")}>English</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.2" onClick={(e)=> changeLanguage("zh_tw")}>繁體中文</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className={styles.user_container}>
                <Switch>
                    <Route path="/user/announcement">
                        <Announcement />
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