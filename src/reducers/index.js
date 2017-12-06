import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import Navigation from './NavigationReducer';
import MapReducer from './MapReducer';
import DemoReducer from './DemoReducer';

// Combines reducers for use
export default combineReducers({
    auth: AuthReducer,
    nav: Navigation,
    map: MapReducer,
    demoAR: DemoReducer,
});
