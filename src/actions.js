import { addAtomId } from './util';
import { APPLY_ATOM, COMMIT, ABORT } from './actionTypes';

export const atom = ({ name, actions = [] }) => {
    return {
        type: APPLY_ATOM,
        name,
        actions
    }
};

export const commit = () => ({
    type: COMMIT
});

export const abort = (error) => ({
    type: ABORT,
    error
});
