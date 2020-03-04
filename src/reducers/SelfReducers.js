import {
    ADMIN_LOGOUT, CURRENT_LAND_LOCATION,
    CURRENT_LAND_UUID,
    LOGOUT,
    SAVE_ADMIN_TOKEN, SAVE_CURRENT_LAND_HALTED, SAVE_CURRENT_LAND_TRANSACTION_ID,
    SAVE_DETAILS_OF_ME, SAVE_IS_ONGOING_TRANSACTION, SAVE_LAND_OWNER_DETAILS,
    SAVE_SERVER_TOKEN
} from 'constants/ActionTypes';

const self = (state = null, action) => {
    switch (action.type) {
        case SAVE_DETAILS_OF_ME:
            return {
                ...state,
                profile: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                profile: ""
            };
        case ADMIN_LOGOUT:
            return {
                ...state,
                adminToken: null
            };
        case SAVE_SERVER_TOKEN:
            return {
                ...state,
                serverToken: action.payload
            };
        case SAVE_ADMIN_TOKEN:
            return {
                ...state,
                adminToken: action.payload
            };
        case SAVE_IS_ONGOING_TRANSACTION:
            return {
                ...state,
                isOngoingTransaction: action.payload
            };
        case SAVE_LAND_OWNER_DETAILS:
            return {
                ...state,
                landOwnerDetails: action.payload
            };
        case CURRENT_LAND_UUID:
            return {
                ...state,
                landUuid: action.payload
            };
        case SAVE_CURRENT_LAND_TRANSACTION_ID:
            return {
                ...state,
                landTransactionId: action.payload
            };
        case SAVE_CURRENT_LAND_HALTED:
            return {
                ...state,
                isHalted: action.payload
            };
        case CURRENT_LAND_LOCATION:
            return {
                ...state,
                landLocation: action.payload
            };
        default:
            return state;
    }
};

export default self;
