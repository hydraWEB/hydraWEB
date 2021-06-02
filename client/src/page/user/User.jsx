import React, { Suspense } from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './User.scss';
import Home from './Home';
import Profile from './Profile';
import News from './News';
const HydraMap = React.lazy(() => import('./HydraMap'));

export default function User(props) {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar">
                <Navbar.Brand href="/user/hydramap">水文與下陷監測巨量資料運算平台</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/user/news">公告</Nav.Link>
                        <Nav.Link href="/user/profile">個人帳號</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="container">
                <Switch>
                    <Route path="/user/news">
                        <News />
                    </Route>
                    <Route path="/user/profile">
                        <Profile />
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