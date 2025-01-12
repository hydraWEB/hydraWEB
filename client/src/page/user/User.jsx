import React, { Suspense, useContext, useEffect, useRef } from 'react';
import {
    Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import styles from './User.module.scss';
import Profile from './profile/Profile';
import Announcement from './announcement/Announcement';
import { userContext } from "../../provider/UserProvider";
import Staff from "./staff/Staff";
import Cookies from "js-cookie";
import { userProfile } from "../../lib/api";
import { useTranslation, Trans } from "react-i18next";
import { store_user_data, remove_user_data } from '../../provider/UserReducer.js'
import { useSelector, useDispatch } from 'react-redux'
import Tutorial from './Tutorial';
import Document from './Document';

const HydraMap = React.lazy(() => import('./map/HydraMap2'));

export default function User(props) {
    const { user, setUser } = useContext(userContext)
    const initialUser = useRef()
    const userState = useSelector((state) => state.user.user_data)
    const dispatch = useDispatch()
    let history = useHistory();
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
                dispatch(store_user_data(res.data.data.user))
            }).catch((err) => {
                
                
            }).finally(() => {
            })
        }
    }, [])

    return (
        <>
            <Navbar collapseOnSelect expand="lg" variant="dark" className={styles.navbar}>
                <Navbar.Brand>
                    <img src='/img/login_display.jpg' className={styles.title_img} />
                    <Link to="/user/hydramap" className={styles.title}>{t('platform_name')}</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">

                    </Nav>
                    <Nav>
                        <Nav.Link><Link to="/user/tutorial" className={styles.link}>{t('tutorial')}</Link></Nav.Link>
                        <Nav.Link><Link to="/user/document" className={styles.link}>{t('overview')}</Link></Nav.Link>

                        <Nav.Link><Link to="/user/announcement" className={styles.link}>{t("announcement")}</Link></Nav.Link>
                        {(typeof user != 'undefined' && user != null)&&
                            <>
                                {typeof user.current != 'undefined' &&
                                    <>
                                        {user.current.is_staff &&
                                            <Nav.Link><Link to="/user/staff/login-analytics" className={styles.link}>{t("admin")}</Link></Nav.Link>
                                        }
                                    </>
                                }
                            </>
                        }


                        <Nav.Link><Link to="/user/profile/userdata" className={styles.link}>{t("account")}</Link></Nav.Link>
                        <NavDropdown className={styles.link} title={t("language")} id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.1" onClick={(e) => changeLanguage("en")}>English</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.2" onClick={(e) => changeLanguage("zh_tw")}>繁體中文</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className={styles.user_container}>
                <Switch>
                    <Route path="/user/tutorial">
                        <Tutorial />
                    </Route>
                    <Route path="/user/document">
                        <Document />
                    </Route>
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
                        <Suspense fallback={
                            <h1>Loading...</h1>}
                        >
                            <HydraMap />
                        </Suspense>
                    </Route>
                </Switch>
            </div>
        </>
    )
}
