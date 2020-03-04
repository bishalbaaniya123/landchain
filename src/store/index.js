import {applyMiddleware, createStore} from 'redux';
import reducer from '../reducers/index';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from "redux-persist";
import thunkMiddleware from 'redux-thunk';

const persistConfig = {
    key:'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

// export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const store = createStore(
    persistedReducer,
    applyMiddleware(thunkMiddleware)
);

export const persistor = persistStore(store);


/*
import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../reducers/index';
import createHistory from 'history/createHashHistory';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';
import { routerMiddleware } from 'react-router-redux';


const history = createHistory ();
const routeMiddleware = routerMiddleware (history);
const sagaMiddleware = createSagaMiddleware ();

const middlewares = [sagaMiddleware, routeMiddleware];

export default function configureStore (initialState) {
    const store = createStore (reducers, initialState,
        compose (applyMiddleware (...middlewares)));

    sagaMiddleware.run (rootSaga);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept ('../reducers/index', () => {
            const nextRootReducer = require ('../reducers/index');
            store.replaceReducer (nextRootReducer);
        });
    }
    return store;
}
export { history };
*/
