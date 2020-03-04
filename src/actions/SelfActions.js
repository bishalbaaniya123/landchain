import {
    ADMIN_LOGOUT,
    DRAWER_TYPE,
    LOGOUT,
    SAVE_ADMIN_TOKEN,
    SAVE_DETAILS_OF_ME,
    SAVE_SERVER_TOKEN,
    IS_FREE_TRIAL_PLAN,
    CURRENT_LAND_UUID,
    CURRENT_LAND_LOCATION,
    SAVE_IS_ONGOING_TRANSACTION,
    SAVE_LAND_OWNER_DETAILS,
    SAVE_CURRENT_LAND_TRANSACTION_ID, SAVE_CURRENT_LAND_HALTED
} from 'constants/ActionTypes';

/*export const saveDetailsOfMe = (details) => dispatch => {
    dispatch({
        type: ,
        payload: details
    });
    return Promise.resolve();
    // return {type: SAVE_DETAILS_OF_ME, payload};
};*/

/*export const saveDetailsOfMe = (details) => dispatch => {
    return {type: SAVE_DETAILS_OF_ME, details};
}*/

export function saveDetailsOfMe(details) {
    return {type: SAVE_DETAILS_OF_ME, payload: details};
}

export function saveCurrentLandTransactionId(details) {
    return {type: SAVE_CURRENT_LAND_TRANSACTION_ID, payload: details};
}

export function saveCurrentLandHalted(details) {
    return {type: SAVE_CURRENT_LAND_HALTED, payload: details};
}

export function saveServerToken(details) {
    return {type: SAVE_SERVER_TOKEN, payload: details};
}


export function logout() {
    return {type: LOGOUT};
}



export function adminLogout() {
    return {type: ADMIN_LOGOUT};
}


export const isFreeTrial = (val) => dispatch => {
    dispatch({
        type: IS_FREE_TRIAL_PLAN,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};


export const saveLandUuid = (val) => dispatch => {
    dispatch({
        type: CURRENT_LAND_UUID,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};



export const saveLandLocation = (val) => dispatch => {
    dispatch({
        type: CURRENT_LAND_LOCATION,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};

export const saveAdminToken = (val) => dispatch => {

    dispatch({
        type: SAVE_ADMIN_TOKEN,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};


export const saveIsOngoingTransaction = (val) => dispatch => {

    dispatch({
        type: SAVE_IS_ONGOING_TRANSACTION,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};


export const saveLandOwnerDetails = (val) => dispatch => {

    dispatch({
        type: SAVE_LAND_OWNER_DETAILS,
        payload: val
    });
    return Promise.resolve();
    // return {type: IS_FREE_TRIAL_PLAN, payload: val};
};


