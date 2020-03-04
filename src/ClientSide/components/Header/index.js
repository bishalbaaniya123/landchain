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
// import IntlMessages from 'util/IntlMessages';
// import LanguageSwitcher from 'components/LanguageSwitcher/index';
import UserInfo from 'components/UserInfo';
import Menu from "components/Header/Menu";
import sampleUser from '../../../assets/images/sampleUser.png';
import Moment from 'react-moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import api from 'ClientSide/routes/Applied/app/api/index';
import {saveDetailsOfMe} from "actions";
import $ from 'jquery';


Moment.startPooledTimer(10000);

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            searchBox: false,
            searchText: '',
            mailNotification: false,
            langSwitcher: false,
            appNotification: false,
            userInfo: false,
            imageUrl: sampleUser,
            userType: "FREE",
            isTrialExpired: false,
            expiryTime: "2019-02-05 22:25:45",
            trialExpiredModal: false,
            showExpiryTime: false,
            isAccountExpired: false,
            canExport: false,
        };
    }

    componentDidMount() {
        if (this.props.imageUrl) {
            this.setState({
                imageUrl: this.props.imageUrl
            })
        }
        if (this.props.userType) {
            this.setState({
                userType: this.props.userType,
                //todo: uncomment this
                // expiryTime: this.props.expiryTime,
            }, () => {
                if (this.state.userType === "CANCELED" || this.state.userType === "FREE") {
                    // let eta_ms = new Date(this.props.expiryTime).getTime() - Date.now();
                    let eta_ms = new Date(this.state.expiryTime).getTime() - Date.now();
                    if (eta_ms > 0) {
                        setTimeout(function () {
                            // window.location.href = "https://core.docpress.io/oauth2/authorize/google";
                        }, eta_ms);
                    }
                }
            })
        }

        if (this.props.expiryTime) {
            this.setState({
                expiryTime: this.props.expiryTime
            })
        }

        if (this.props.canExport) {
            this.setState({
                canExport: this.props.canExport
            })
        } else {
            this.setState({
                canExport: this.props.canExport
            })
        }
        /*api.getLatestPlan(this.props.token)
            .then(result => {
                if (result.expire_time) {
                    this.setState({
                        expiryTime: result.expire_time,
                        showExpiryTime: true
                    });

                    let eta_ms = new Date(result.expire_time).getTime() - Date.now();
                    if (eta_ms > 0) {
                        let thisState = this;
                        setTimeout(function () {
                            thisState.setState({
                                userType: "EXPIRED"
                            });

                            api.getUserInfoAfterLogin(thisState.props.token)
                                .then(response => {
                                    thisState.props.saveDetailsOfMe(response);
                                    thisState.setState({
                                        trialExpiredModal: true,
                                    })
                                });
                        }, eta_ms);
                    }
                }
            });*/
    }

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


    updateSearchText(evt) {
        this.setState({
            searchText: evt.target.value,
        });
    }

    redirectToSettings = () => {
        this.props.history.push({
            pathname: "/settings"
        })
    };

    onClickTrialExpiredModal = () => {
        this.setState({
            onClickTrialExpiredModal: !this.state.onClickTrialExpiredModal,
        });
        location.reload();
    };


    render() {
        const {drawerType, locale, navigationStyle, horizontalNavPosition} = this.props;
        const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'd-flex d-xl-none' : drawerType.includes(COLLAPSED_DRAWER) ? 'd-flex' : 'd-none';

        let timeForNextWeek = "2019-01-18T14:30:59.000+0000";


        // for testing
        let currentUserType = this.state.userType;
        // currentUserType = "FREE";
        // end for testing
        let ShowUpgradePrompt = () => {
            let canExport = this.state.canExport;
            switch (currentUserType) {
                /*case "FREE":
                case "EXPIRED":
                    return (
                        <div className="upgrade-account-prompt">
                            <p>
                                You need to
                                <a href="javascript:;" onClick={this.redirectToSettings}>
                                    &nbsp;upgrade&nbsp;
                                </a>
                                your account to export
                            </p>
                        </div>
                    );*/
                case "FREE":
                    if (canExport === true) {
                        return (
                            <div className="upgrade-account-prompt" style={{display: "block"}}>
                                <p>Your subscription will expire&nbsp;
                                    <Moment fromNow>{this.state.expiryTime}</Moment>.
                                    <a href="javascript:;" onClick={this.redirectToSettings}
                                       className="upgrade-now-anchor">
                                        &nbsp;Upgrade now&nbsp;
                                    </a>
                                </p>
                            </div>
                        );
                    } else {
                        return (<div className="upgrade-account-prompt">
                            <p>
                                You need to
                                <a href="javascript:;" onClick={this.redirectToSettings}>
                                    &nbsp;upgrade&nbsp;
                                </a>
                                your account to export
                            </p>
                        </div>);
                    }
                case "TRIAL":
                    /*let expiryDate = this.state.expiryTime;
                    let thisState = this;*/
                    /*setTimeout(function () {
                        thisState.setState({
                            trialExpiredModal: true,
                        })
                    }, eta_ms);*/
                    /*setTimeout(function () {
                        if(Date.now() > expiryDate){
                            location.reload();
                        }
                    }, timeout);*/
                    /*return (
                        <div className="upgrade-account-prompt" style={{backgroundColor: "#22bcd4", display: "block"}}>
                            <p>Your trial will expire&nbsp;
                                {this.state.showExpiryTime ?
                                    <Moment fromNow>{this.state.expiryTime}</Moment>
                                    :
                                    ""
                                }
                                .
                                <a href="javascript:;" onClick={this.redirectToSettings}
                                    className="upgrade-now-anchor">
                                    &nbsp;Upgrade now&nbsp;
                                </a>
                            </p>
                        </div>
                    );*/
                    return ("");
                case "CANCELED":
                    return (
                        <div className="upgrade-account-prompt" style={{display: "block"}}>
                            <p>Your subscription will expire&nbsp;
                                <Moment fromNow>{this.state.expiryTime}</Moment>
                            </p>
                        </div>
                    );
                case "PREMIUM":

                    return ("");
                default:
                    return ("");
            }
        };
        return (
            <div className="app-main-header">
                <div className="d-flex app-toolbar align-items-center">
                    {navigationStyle === HORIZONTAL_NAVIGATION ?
                        <div className="app-logo-bl">
                            <div className="d-block d-md-none">
                                <span className="jr-menu-icon"
                                      onClick={this.onToggleCollapsedNav}>
                                    <span className="menu-icon"/>
                                </span>
                            </div>
                            <div className="app-logo pointer d-none d-md-block">
                                <img className="d-none d-lg-block" alt='...' src={this.state.imageUrl}/>
                                {/*<img className="d-none d-lg-block" alt='...' src='http://via.placeholder.com/105x36'/>*/}
                                <img className="d-block d-lg-none mr-3" alt='...'
                                     src={this.state.imageUrl}/>
                                {/*src='http://via.placeholder.com/32x32'/>*/}
                            </div>
                        </div>
                        :
                        <span className={`jr-menu-icon pointer ${drawerStyle}`}
                              onClick={this.onToggleCollapsedNav}>
                            <span className="menu-icon"/>
                        </span>
                    }

                    <ShowUpgradePrompt/>


                    {/*<SearchBox styleName="d-none d-lg-block"
                               onChange={this.updateSearchText.bind(this)}
                               value={this.state.searchText}/>*/}
                    {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === INSIDE_THE_HEADER) &&
                    <Menu/>}

                    <ul className="header-notifications list-inline ml-auto">
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
                                        src={this.state.imageUrl}
                                        className="pointer user-avatar size-30"/>
                                </DropdownToggle>

                                <DropdownMenu right>

                                    <UserInfo/>
                                </DropdownMenu>
                            </Dropdown>

                        </li>
                    </ul>
                </div>
                <SweetAlert show={this.state.trialExpiredModal}
                            error
                            title={<p className="sweet-alert-title">Your trial has expired</p>}
                            onConfirm={this.onClickTrialExpiredModal}
                >
                    Please Upgrade to export
                </SweetAlert>

            </div>
        );
    }

}

const mapStateToProps = (state) => {


    const {drawerType, locale, navigationStyle, horizontalNavPosition} = state.settings;

    if (state.selfReducers !== null) {

        // $(".user-avatar").attr("src", state.selfReducers.profile.imageUrl);

        return {
            imageUrl: state.selfReducers.profile.image_url,
            userType: state.selfReducers.profile.user_type,
            drawerType, locale, navigationStyle, horizontalNavPosition,
            token: state.selfReducers.serverToken,
            expiryTime: state.selfReducers.profile.expire_time,
            canExport: state.selfReducers.profile.can_export
        };
    } else {
        return {drawerType, locale, navigationStyle, horizontalNavPosition}
    }
};

export default withRouter(connect(mapStateToProps, {toggleCollapsedNav, switchLanguage, saveDetailsOfMe})(Header));