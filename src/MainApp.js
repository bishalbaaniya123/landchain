import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router";

import App from './containers/App';

import {PersistGate} from "redux-persist/lib/integration/react";


import {persistor, store} from './store';

// user routes
import Documents from './ClientSide/routes/Applied/Documents';
import TrialPaymentPage from './ClientSide/routes/Applied/TrialPaymentPage';
import ExportsHistory from './ClientSide/routes/Applied/ExportsHistory';
import Websites from './ClientSide/routes/Applied/Websites';
import Settings from './ClientSide/routes/Applied/Settings';
import RedirectGoogle from './ClientSide/routes/Applied/RedirectGoogle';
import RedirectPaypal from './ClientSide/routes/Applied/RedirectPaypal';

// admin routes
import adminLogin from './app/routes/Applied/Login';
import adminMain from './app/routes/Applied/SamplePage';
import adminUsers from './app/routes/Applied/Users';
import adminPlans from './app/routes/Applied/Plans';
import adminSupport from './app/routes/Applied/mail/basic';

let app = App;

//landchain routes
import LandChainLogin from './LandChain/routes/Applied/Login';
import LandChainMain from './LandChain/routes/Applied/Main';
import LandChainUsers from './LandChain/routes/Applied/Users';
import LandChainDetails from './LandChain/routes/Applied/Details';

const mainApp = () => ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Switch>
                    {/*landchain routes*/}
                    <Redirect path="/" exact to="/landchain-login"/>
                    <Route path="/landchain-login" component={LandChainLogin}/>
                    <Route path="/land" component={LandChainMain}/>
                    <Route path="/land-details" component={LandChainDetails}/>
                    <Route path="/users" component={LandChainUsers}/>
                    <Redirect path="*" exact to="/landchain-login"/>

                    {/*user routes*/}
{/*
                    <Redirect path="/" exact to="/documents"/>
                    <Route path="/documents" component={Documents}/>
                    <Route path="/new-user" component={TrialPaymentPage}/>
                    <Route path="/exports" component={ExportsHistory}/>
                    <Route path="/websites" component={Websites}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/redirect-google" component={RedirectGoogle}/>
                    <Route path="/redirect-paypal" component={RedirectPaypal}/>
*/}

                    {/*admin routes*/}
{/*
                    <Route path="/admin-login" exact component={adminLogin}/>
                    <Route path="/admin-docpress" component={adminMain}/>
                    <Route path="/admin-users" component={adminUsers}/>
                    <Route path="/admin-plans" component={adminPlans}/>
                    <Route path="/admin-support" component={adminSupport}/>
*/}
                </Switch>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('app-site')
);
export default mainApp;
