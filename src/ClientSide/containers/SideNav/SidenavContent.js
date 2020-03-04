import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import CustomScrollbars from "util/CustomScrollbars";
//Dont remove this line below even though it is unused.
import Nav from "reactstrap/es/Nav";
import '../../../assets/css/self_css.css';
import $ from 'jquery';
import {connect} from "react-redux";
import {toggleCollapsedNav, updateWindowWidth} from "actions";


class SidenavContent extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
        const {history} = this.props;
        const that = this;
        const pathname = `#${history.location.pathname}`;

        const subMenuLi = document.querySelectorAll('.sub-menu > li');
        for (let i = 0; i < subMenuLi.length; i++) {
            subMenuLi[i].onclick = function (event) {
                event.stopPropagation();
            }
        }

        const menuLi = document.getElementsByClassName('menu');
        for (let i = 0; i < menuLi.length; i++) {
            menuLi[i].onclick = function (event) {
                for (let j = 0; j < menuLi.length; j++) {
                    const parentLi = that.closest(this, 'li');
                    if (menuLi[j] !== this && (parentLi === null || !parentLi.classList.contains('open'))) {
                        menuLi[j].classList.remove('open')
                    }
                }
                this.classList.toggle('open');
                event.stopPropagation();
            }
        }

        const activeLi = document.querySelector('a[href="' + pathname + '"]');
        try {
            const activeNav = this.closest(activeLi, 'ul');
            if (activeNav.classList.contains('sub-menu')) {
                this.closest(activeNav, 'li').classList.add('open');
            } else {
                this.closest(activeLi, 'li').classList.add('open');
            }
        } catch (error) {

        }

    }

    closest(el, selector) {
        try {
            let matchesFn;
            // find vendor prefix
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
                if (typeof document.body[fn] == 'function') {
                    matchesFn = fn;
                    return true;
                }
                return false;
            });

            let parent;

            // traverse parents
            while (el) {
                parent = el.parentElement;
                if (parent && parent[matchesFn](selector)) {
                    return parent;
                }
                el = parent;
            }
        } catch (e) {

        }

        return null;
    }

    redirectToPage = (pageName) => {
        $(".new-menu a").removeClass("active-menu");
        $("#" + pageName).addClass("active-menu");

        this.props.toggleCollapsedNav(!this.props.navCollapsed);

        this.props.history.push({
            pathname: "/" + pageName
        })
    };

    render() {
        return (
            <CustomScrollbars className="scrollbar" style={{height: 'calc(100vh - 70px)'}}>
                <ul className="nav-menu">

                    <li className="nav-header"></li>
                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("documents")}
                           id="documents"
                        >
                            <i className="zmdi zmdi-file-text zmdi-hc-fw"/>
                            <span className="nav-text">
                                Documents
                            </span>
                        </a>
                    </li>
                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("exports")}
                           id="exports"
                        >
                            <i className="zmdi zmdi-eject zmdi-hc-fw"/>
                            <span className="nav-text">
                                Export History
                            </span>
                        </a>
                    </li>
                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("websites")}
                           id="websites"
                        >
                            <i className="zmdi zmdi-plus-circle-o zmdi-hc-fw"/>
                            <span className="nav-text">
                                Websites
                            </span>
                        </a>
                    </li>
                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("settings")}
                           id="settings"
                        >
                            <i className="zmdi zmdi-settings zmdi-hc-fw"/>
                            <span className="nav-text">
                                Settings
                            </span>
                        </a>
                    </li>
                    {/*
                    <li className="menu no-arrow">
                        <NavLink to="/documents">
                            <i className="zmdi zmdi-file-text zmdi-hc-fw"/>
                            <span className="nav-text">
                                Documents
                            </span>
                        </NavLink>
                    </li>
                    <li className="menu no-arrow">
                        <NavLink to="/exports">
                            <i className="zmdi zmdi-eject zmdi-hc-fw"/>
                            <span className="nav-text">
                                Exports
                            </span>
                        </NavLink>
                    </li>
*/}
                    {/*
                    <li className="menu no-arrow">
                        <NavLink to="/exports">
                            <i className="zmdi zmdi-eject zmdi-hc-fw"/>
                            <span className="nav-text">
                                Exports
                            </span>
                        </NavLink>
                    </li>
*/}
                    {/*
                    <li className="menu no-arrow">
                        <NavLink to="/add-url">
                            <i className="zmdi zmdi-plus-circle-o zmdi-hc-fw"/>
                            <span className="nav-text">
                                Add Url
                            </span>
                        </NavLink>
                    </li>
                    <li className="menu no-arrow" id="settings-tab">
                        <NavLink to="/settings">
                            <i className="zmdi zmdi-settings zmdi-hc-fw"/>
                            <span className="nav-text">
                                Settings
                            </span>
                        </NavLink>
                    </li>
*/}
                </ul>
            </CustomScrollbars>
        );
    }
}


const mapStateToProps = ({settings}) => {
    const {navCollapsed, drawerType, width, isDirectionRTL, navigationStyle} = settings;
    return {navCollapsed, drawerType, width, isDirectionRTL, navigationStyle}
};


export default withRouter(connect(mapStateToProps, {toggleCollapsedNav, updateWindowWidth})(SidenavContent));
