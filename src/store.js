import { createStore } from 'redux'

const globalStore = (state = { loading: true, lastAction: '' }, action) => {
    const newState = { ... state };
    switch (action.type) {
        case 'SET_LOADED':
            newState.loading = false;
            return newState;
        case 'SET_NOT_LOADED':
            newState.loading = true;
            return newState;
        case 'SET_LAST_ACTION':
            return Object.assign({}, state, { lastAction: action.lastAction });
        default:
            return state;
    }
}

const store = createStore(globalStore);

export default store;