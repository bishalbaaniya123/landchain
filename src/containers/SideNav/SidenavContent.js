import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';

import IntlMessages from 'util/IntlMessages';
import CustomScrollbars from "util/CustomScrollbars";
import $ from "jquery";
import {connect} from "react-redux";
import {toggleCollapsedNav, updateWindowWidth} from "actions";


class SidenavContent extends Component {

    componentDidMount() {
        const {history} = this.props;
        const that = this;
        const pathname = `#${history.location.pathname}`;// get current path

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

        const activeLi = document.querySelector('a[href="' + pathname + '"]');// select current a element
        try {
            const activeNav = this.closest(activeLi, 'ul'); // select closest ul
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
        $("." + pageName).addClass("active-menu");

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
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("admin-docpress")}
                           id="dashboard-main-button-menu" className="admin-docpress"
                        >
                            <i className="zmdi zmdi-view-dashboard zmdi-hc-fw"/>
                            <span className="nav-text">
                                Dashboard
                            </span>
                        </a>
                    </li>


                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("admin-users")}
                           id="users-main-button-menu" className="admin-users"
                        >
                            <i className="zmdi zmdi-account-circle zmdi-hc-fw"/>
                            <span className="nav-text">
                                Users
                            </span>
                        </a>
                    </li>



                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("admin-plans")}
                           id="plans-main-button-menu" className="admin-plans"
                        >
                            <i className="zmdi zmdi-money zmdi-hc-fw"/>
                            <span className="nav-text">
                                Plans
                            </span>
                        </a>
                    </li>


{/*

                    <li className="new-menu">
                        <a href="javascript:void(0)" onClick={() => this.redirectToPage("admin-support")}
                           id="support-main-button-menu"
                        >
                            <i className="zmdi zmdi-headset-mic zmdi-hc-fw"/>
                            <span className="nav-text">
                                Support
                            </span>
                        </a>
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

// export default withRouter(SidenavContent);
