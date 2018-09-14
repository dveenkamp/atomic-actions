import { APPLY_ATOM, COMMIT, ABORT } from './actionTypes';

const enhanceReducer = rootReducer => (state, action) => {
    switch(action.type) {
        case APPLY_ATOM: {
            return startAtomicUpdate(state)
        }
        case COMMIT: {
            //inProcess becomes the real state
            return state.__inProcess;
        }
        case ABORT: {
            return abortUpdate(state);
        }
    }

    if(state && state.__inProcess) {
        return {
            ...state,
            //The reducer will think the inProcess state is the real state
            __inProcess: rootReducer(state.__inProcess, action)
        }
    }

    return rootReducer(state, action);
}

const startAtomicUpdate = state => ({
    ...state,
    __inProcess: state
});

const abortUpdate = state => {
    const { __inProcess, ...existingState } = state;
    return existingState;
};

export default enhanceReducer;
