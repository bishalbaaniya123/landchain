import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import Header from './components/Header/index';
import Sidebar from './containers/SideNav/index';
import Footer from './components/Footer';

import {
    ABOVE_THE_HEADER,
    BELOW_THE_HEADER,
    COLLAPSED_DRAWER,
    FIXED_DRAWER,
    HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {isIOS, isMobile} from 'react-device-detect';
import asyncComponent from '../util/asyncComponent';
import TopNav from 'components/TopNav';


import samplePage from './routes/Applied/Documents';


class App extends React.Component {

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
                            <Switch>
                                <Route path={`/client/documents`}
                                       component={samplePage}/>
                                <Route path={`/client/exports`}
                                       component={asyncComponent(() => import('./routes/Applied/ExportsHistory'))}/>
                                <Route path={`${match.url}/documents`}
                                       component={asyncComponent(() => import('./routes/Applied/Documents'))}/>
                                <Route path={`${match.url}/exports`}
                                       component={asyncComponent(() => import('./routes/Applied/ExportsHistory'))}/>
                                <Route path={`${match.url}/add-url`}
                                       component={asyncComponent(() => import('./routes/Applied/Websites/index'))}/>
                                <Route path={`${match.url}/settings`}
                                       component={asyncComponent(() => import('./routes/Applied/Settings/index'))}/>
                                <Route path={`${match.url}/redirect-google`}
                                       component={asyncComponent(() => import('./routes/Applied/RedirectGoogle/index'))}/>
                                <Route component={asyncComponent(() => import('components/Error404'))}/>
                            </Switch>
                        </div>
                        {/*<Footer/>*/}
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
export default withRouter(connect(mapStateToProps)(App));