import {
    IS_FREE_TRIAL_PLAN,
} from 'constants/ActionTypes';

const isFreeTrial = (state = null, action) => {
    switch (action.type) {
        case IS_FREE_TRIAL_PLAN:
            return action.payload === true;
        default:
            return state;
    }
};

export default isFreeTrial;
