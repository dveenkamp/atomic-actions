import { commit } from './actions';
import { APPLY_ATOM, COMMIT, ABORT } from './actionTypes';
import { isReduxAtomAction, addAtomId } from './util';

const NO_CURRENT_ATOM = '__NO_CURRENT_ATOM__';

const middleware = ({ dispatch, getState }) => {
    let atomId = 0;
    let currentAtomId = NO_CURRENT_ATOM;
    let rollingBack = false;
    let actionQueue = [];

    const clearAtomState = () => {
        currentAtomId = NO_CURRENT_ATOM;
        rollingBack = false;
        actionQueue = [];
    };

    return next => action => {
        if(!isReduxAtomAction(action.type) && currentAtomId === NO_CURRENT_ATOM) {
            //This is not an action we're looking for
            return next(action);
        }

        if(action.type === APPLY_ATOM) {
            next(action);
            const { actions } = action;

            currentAtomId = ++atomId;

            [...actions, commit()].forEach(action => {
                if(!rollingBack) {
                    dispatch(addAtomId(currentAtomId, action));
                }
            });
        } else if (action.type === COMMIT) {
            next(action);
            clearAtomState();
        } else if (action.type === ABORT) {
            rollingBack = true;
            next(action);
            clearAtomState();
        } else if (action.__atomId === currentAtomId) {
            //Since a reducer throwing an error is a side-effect (therefore a no-no)
            //this is most likely to happen in the event of a middleware throwing,
            //or a bug in reducer code
            try {
                return next(action);
            } catch(error) {
                dispatch(abort(error));
            }
        } else {
            actionQueue.push(action);
        }
    }
};

export default middleware;
