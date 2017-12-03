import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import Navigation from './NavigationReducer';
import MapReducer from './MapReducer';
import DemoReducer from './DemoReducer';

export default combineReducers({
    auth: AuthReducer,
    nav: Navigation,
    map: MapReducer,
    demoAR: DemoReducer,
});
