import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Dropdown, DropdownMenu, DropdownToggle} from 'reactstrap';
import {COLLAPSED_DRAWER, FIXED_DRAWER, HORIZONTAL_NAVIGATION, INSIDE_THE_HEADER} from 'constants/ActionTypes';
import SearchBox from 'components/SearchBox';
import MailNotification from '../MailNotification/index';
import AppNotification from '../AppNotification/index';
import CardHeader from 'components/dashboard/Common/CardHeader/index';
import {switchLanguage, toggleCollapsedNav} from 'actions/Setting';
import LanguageSwitcher from 'components/LanguageSwitcher/index';
import UserInfo from 'components/UserInfoAdmin';
import Menu from "components/Header/Menu";

import sampleUser from "assets/images/sampleUser.png";
import {adminLogout} from "actions";


class Header extends React.Component {

    componentDidMount(){
        /*if(this.props.adminToken === null || this.props.adminToken === undefined || this.props.adminToken === ""){
            window.location.href="/admin-login";
/!*
            this.props.history.push({
                pathname: "/admin-login"
            })
*!/
        }*/
    };


    onAppNotificationSelect = () => {
        this.setState({
            appNotification: !this.state.appNotification
        })
    };
    onMailNotificationSelect = () => {
        this.setState({
            mailNotification: !this.state.mailNotification
        })
    };

    onUserInfoSelect = () => {
        this.setState({
            userInfo: !this.state.userInfo
        })
    };

    onLangSwitcherSelect = (event) => {
        this.setState({
            langSwitcher: !this.state.langSwitcher
        })
    };
    onSearchBoxSelect = () => {
        this.setState({
            searchBox: !this.state.searchBox
        })
    };
    handleRequestClose = () => {
        this.setState({langSwitcher: false, mailNotification: false, appNotification: false, searchBox: false});
    };
    onToggleCollapsedNav = (e) => {
        const val = !this.props.navCollapsed;
        this.props.toggleCollapsedNav(val);
    };

    constructor() {
        super();
        this.state = {
            searchBox: false,
            searchText: '',
            mailNotification: false,
            langSwitcher: false,
            appNotification: false,
            userInfo: false

        }
    }

    updateSearchText(evt) {
        this.setState({
            searchText: evt.target.value,
        });
    }

    render() {
        const {drawerType, locale, navigationStyle, horizontalNavPosition} = this.props;
        const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'd-flex d-xl-none' : drawerType.includes(COLLAPSED_DRAWER) ? 'd-flex' : 'd-none';

        return (
            <div className="app-main-header">
                <div className="d-flex app-toolbar align-items-center">
                    {navigationStyle === HORIZONTAL_NAVIGATION  ?
                        <div className="app-logo-bl">
                            <div className="d-block d-md-none">
                                <span className="jr-menu-icon"
                                      onClick={this.onToggleCollapsedNav}>
                                    <span className="menu-icon"/>
                                </span>
                            </div>
                            <div className="app-logo pointer d-none d-md-block">
                                <img className="d-none d-lg-block" alt='...' src='http://via.placeholder.com/105x36'/>
                                <img className="d-block d-lg-none mr-3" alt='...'
                                     src='http://via.placeholder.com/32x32'/>
                            </div>
                        </div>
                        :
                        <span className={`jr-menu-icon pointer ${drawerStyle}`}
                              onClick={this.onToggleCollapsedNav}>
                            <span className="menu-icon"/>
                        </span>
                    }

                    {/*<SearchBox styleName="d-none d-lg-block"
                               onChange={this.updateSearchText.bind(this)}
                               value={this.state.searchText}/>*/}
                    {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === INSIDE_THE_HEADER) &&
                    <Menu/>}

                    <ul className="header-notifications list-inline ml-auto">
                        <li className="d-inline-block d-lg-none list-inline-item">
                            {/*<Dropdown
                                className="quick-menu nav-searchbox"
                                isOpen={this.state.searchBox}
                                toggle={this.onSearchBoxSelect.bind(this)}>

                                <DropdownToggle
                                    className="d-inline-block"
                                    tag="span"
                                    data-toggle="dropdown">
                                    <span className="icon-btn size-30">
                                        <i className="zmdi zmdi-search zmdi-hc-fw"/>
                                    </span>
                                </DropdownToggle>

                                <DropdownMenu right className="p-0">
                                    <SearchBox styleName="search-dropdown" placeholder=""
                                               onChange={this.updateSearchText.bind(this)}
                                               value={this.state.searchText}/>
                                </DropdownMenu>
                            </Dropdown>*/}
                        </li>
                        <li className="list-inline-item">
                            <Dropdown
                                className="quick-menu"
                                isOpen={this.state.langSwitcher}
                                toggle={this.onLangSwitcherSelect.bind(this)}>

                                <DropdownToggle
                                    className="d-inline-block"
                                    tag="span"
                                    data-toggle="dropdown">
                                    <div className="d-flex align-items-center pointer">
                                        <i className={`flag flag-24 flag-${locale.icon}`}/>
                                    </div>
                                </DropdownToggle>

                                <DropdownMenu right className="w-50">
                                    <LanguageSwitcher switchLanguage={this.props.switchLanguage}
                                                      handleRequestClose={this.handleRequestClose}/>
                                </DropdownMenu>
                            </Dropdown>


                        </li>
                        <li className="list-inline-item app-tour">
                        </li>
                        <li className="list-inline-item mail-tour">
                        </li>
                        <li className="list-inline-item user-nav">
                            <Dropdown
                                className="quick-menu"
                                isOpen={this.state.userInfo}
                                toggle={this.onUserInfoSelect.bind(this)}>

                                <DropdownToggle
                                    className="d-inline-block"
                                    tag="span"
                                    data-toggle="dropdown">
                                    <img
                                        alt='...'
                                        src={sampleUser}
                                        className="pointer user-avatar size-30"/>
                                </DropdownToggle>

                                <DropdownMenu right>

                                    <UserInfo/>
                                </DropdownMenu>
                            </Dropdown>

                        </li>
                    </ul>
                </div>
            </div>
        );
    }

}

const mapDispatchToProps = {
    toggleCollapsedNav: toggleCollapsedNav,
    switchLanguage: switchLanguage,
};

const mapStateToProps = (state) => {
    const {drawerType, locale, navigationStyle, horizontalNavPosition} = state.settings;
    if(state.selfReducers === null){
        return {drawerType, locale, navigationStyle, horizontalNavPosition};
    } else {
        return {drawerType, locale, navigationStyle, horizontalNavPosition,
            adminToken: state.selfReducers.adminToken
        };
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));