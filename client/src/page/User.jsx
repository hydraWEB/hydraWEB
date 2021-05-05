import React from 'react';
import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCog, faDatabase, faPrint, faMapMarker, faTint, faSignOutAlt, faSearch, faCircle, faPlusCircle, faCircleNotch, faArrowCircleDown, faICursor, faDotCircle, faExchangeAlt, faColumns, faClone, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import Home from './Home';
import HydraMap from './HydraMap';

import './User.scss';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            
            <div className="App">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" classname="navbar">
                <Navbar.Brand href="home">水文與下陷監測巨量資料運算平台</Navbar.Brand>
                    <Nav className='rightNavbar'>
                        <Nav.Link href="notification">公告</Nav.Link>
                        <Nav.Link href="profile">個人帳號</Nav.Link>
                    </Nav>        
                    
                </Navbar>
                <div className="top-level-nav">
                    <Link to="/user/home">
                        <OverlayTrigger
                            key='right'
                            placement='right'
                            overlay={
                                <Tooltip id='tooltip-right' className='tooltip'>
                                    搜寻
                        </Tooltip>
                            }>
                            <FontAwesomeIcon icon={faSearch} size="lg" color="white" id='app-icon' />
                        </OverlayTrigger>
                    </Link>
                    <nav className='top-level-nav-normal'>
                        <ul>
                            <li>
                                <Link to="/user/hydramap">
                                    <OverlayTrigger
                                        key='right'
                                        placement='right'
                                        overlay={
                                            <Tooltip id='tooltip-right' className='tooltip'>
                                                圖層套疊
                                            </Tooltip>
                                        }>
                                        <FontAwesomeIcon icon={faClone} size="lg" color="white" />
                                    </OverlayTrigger>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/hydramap">
                                    <OverlayTrigger
                                        key='right'
                                        placement='right'
                                        overlay={
                                            <Tooltip id='tooltip-right' className='tooltip'>
                                                3D轉換
                                            </Tooltip>
                                        }>
                                        <FontAwesomeIcon icon={faExchangeAlt} size="lg" color="white" />
                                    </OverlayTrigger>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <OverlayTrigger
                                        key='right'
                                        placement='right'
                                        overlay={
                                            <Tooltip id='tooltip-right' className='tooltip'>
                                                環域分析
                                            </Tooltip>
                                        }>
                                        <FontAwesomeIcon icon={faStreetView} size="lg" color="white" />
                                    </OverlayTrigger>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <OverlayTrigger
                                        key='right'
                                        placement='right'
                                        overlay={
                                            <Tooltip id='tooltip-right' className='tooltip'>
                                                列印
                        </Tooltip>
                                        }>
                                        <FontAwesomeIcon icon={faPrint} size="lg" color="white" />
                                    </OverlayTrigger>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <OverlayTrigger
                                        key='right'
                                        placement='right'
                                        overlay={
                                            <Tooltip id='tooltip-right' className='tooltip'>
                                                定位
                        </Tooltip>
                                        }>
                                        <FontAwesomeIcon icon={faMapMarker} size="lg" color="white" />
                                    </OverlayTrigger>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="fragment">
                    <Switch>
                        <Route path="/user/home">
                            <Home />
                        </Route>
                        <Route path="/user/hydramap">
                            <HydraMap />
                        </Route>
                    </Switch>
                </div>
            </div>

        )
    }
}

export default User;