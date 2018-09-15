import { createStore, applyMiddleware, combineReducers } from 'redux';
import atomMiddleware from './middleware';
import enhanceReducer from './reducer';
import { atom } from './actions';

const counter = (state = 0, action) => {
    switch(action.type) {
        case 'INCREMENT': {
            return ++state;
        }
        default: {
            return state;
        }
    }
}

const store = createStore(
    enhanceReducer(combineReducers({counter})),
    applyMiddleware(
        atomMiddleware
    )
);

store.dispatch(atom({
    name: 'INCREMENT_TWICE',
    actions: [
        {type: 'INCREMENT'},
        {type: 'INCREMENT'}
    ]
}));

console.log(store.getState());



export {
    atomMiddleware,
    enhanceReducer,
    atom
};
