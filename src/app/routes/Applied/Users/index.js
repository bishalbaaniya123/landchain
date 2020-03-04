import React from 'react';
import CardBox from '../../../../components/CardBox';
import OrderTable from '../../../../components/dashboard/eCommerce/OrderTable';
// import IntlMessages from '../../../../util/IntlMessages';
import UsersTable from './UsersTable';

import {connect} from 'react-redux';
import {
    ABOVE_THE_HEADER,
    BELOW_THE_HEADER,
    COLLAPSED_DRAWER,
    FIXED_DRAWER,
    HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {isIOS, isMobile} from 'react-device-detect';


import Sidebar from "containers/SideNav/index";
import TopNav from 'components/TopNav';
import Footer from 'components/Footer';
import Header from "components/Header";
import {withRouter} from "react-router-dom";
import $ from "jquery";

// const BasicTables = () => {
class BasicTables extends React.Component {

    componentDidMount(){
        $(".new-menu a").removeClass("active-menu");
        $("#users-main-button-menu").addClass("active-menu");
        document.title="Admin - ExportsHistory";

        this.props.history.push({
            pathname: "/admin-users"
        });
    }

    render() {

        const {match, drawerType, navigationStyle, horizontalNavPosition} = this.props;
        const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'fixed-drawer' : drawerType.includes(COLLAPSED_DRAWER) ? 'collapsible-drawer' : 'mini-drawer';

        //set default height and overflow for iOS mobile Safari 10+ support.
        if (isIOS && isMobile) {
            document.body.classList.add('ios-mobile-view-height')
        } else if (document.body.classList.contains('ios-mobile-view-height')) {
            document.body.classList.remove('ios-mobile-view-height')
        }


        return (
            <div className={`app-container ${drawerStyle}`}>
                <Sidebar/>

                <div className="app-main-container">
                    <div className="app-header">
                        {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === ABOVE_THE_HEADER) &&
                        <TopNav styleName="app-top-header"/>}
                        <Header/>
                        {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === BELOW_THE_HEADER) &&
                        <TopNav/>}

                    </div>

                    <main className="app-main-content-wrapper">
                        <div className="app-main-content">
                            <div className="app-wrapper">
                                <div className="animated slideInUpTiny animation-duration-3">
                                    <div className="row">
                                        <CardBox styleName="col-12" cardStyle="p-0 overflow-hidden"
                                                 heading={"ExportsHistory"}
                                                 headerOutside>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="jr-card">
                                                        <div className="jr-card-header d-flex align-items-center">
                                                            {/*<h3 className="mb-0">Users</h3>*/}
                                                            {/*<div className="ml-3">
                                                                <span className="text-white badge badge-success">
                                                                    Data Table
                                                                </span>
                                                            </div>*/}
                                                        </div>
                                                        <UsersTable/>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

}

const mapStateToProps = ({settings}) => {

    const {drawerType, navigationStyle, horizontalNavPosition} = settings;
    return {drawerType, navigationStyle, horizontalNavPosition}
};
export default withRouter(connect(mapStateToProps)(BasicTables));
// export default BasicTables;

