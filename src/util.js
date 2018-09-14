import { APPLY_ATOM, COMMIT, ABORT } from './actionTypes';

export const addAtomId = (id, action) => {
    //So we don't accidentally apply the id to
    //the result of another middleware... it could get weird.
    if(typeof action === 'object') {
        return {
            ...action,
            __atomId: id
        }
    }
    return action;
}

export const isReduxAtomAction = type => (
    type === APPLY_ATOM ||
    type === COMMIT ||
    type === ABORT
);
