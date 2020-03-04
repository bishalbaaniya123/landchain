import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Settings from './Settings';
import SelfReducers from './SelfReducers';
import isFreeTrial from './IsFreeTrial';
import Auth from './Auth';



const reducers = combineReducers ({
    routing: routerReducer,
    settings: Settings,
    selfReducers: SelfReducers,
    auth: Auth,
    isFreeTrial: isFreeTrial
});

export default reducers;
