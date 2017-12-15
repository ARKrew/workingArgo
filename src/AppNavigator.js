import { StackNavigator } from 'react-navigation';
import LoginForm from './components/LoginForm';
import RootsTab from './components/RootsTab';
import List from './components/screens/List';
import Map from './components/screens/Map';
import Profile from './components/screens/Profile';
// import DemoARPortal from './components/screens/ListScreens/DemoARPortal';
import MainSceneAR from './components/screens/ListScreens/MainSceneAR';

export const ROUTES = {
  login: 'LoginForm',
  rootstab: 'RootsTab',
  List: 'List',
  map: 'Map',
  profile: 'Profile',
  // DemoARPortal: 'DemoARPortal',
  MainSceneAR: 'MainSceneAR',
};

export const AppNavigator = StackNavigator(
{
    [ROUTES.login]: { screen: LoginForm },
    [ROUTES.rootstab]: { screen: RootsTab },
    [ROUTES.List]: { screen: List },
    [ROUTES.map]: { screen: Map },
    [ROUTES.profile]: { screen: Profile },
    [ROUTES.MainSceneAR]: { screen: MainSceneAR },
    // [ROUTES.DemoARPortal]: { screen: DemoARPortal },
}, {
    cardStyle: {
        backgroundColor: '#fff'
      },
    mode: 'modal',
    headerMode: 'none',
  }
);

export const { router } = AppNavigator;
export const routerInitialState = router.getStateForAction(
    router.getActionForPathAndParams(ROUTES.login)
);
