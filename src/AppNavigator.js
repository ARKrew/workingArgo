import { StackNavigator } from 'react-navigation';
import LoginForm from './components/LoginForm';
import RootsTab from './components/RootsTab';
import List from './components/screens/List';
import DemoARPortal from './components/screens/ListScreens/DemoARPortal';
import MainSceneAR from './components/screens/ListScreens/MainSceneAR';

export const ROUTES = {
  login: 'LoginForm',
  rootstab: 'RootsTab',
  List: 'List',
  MainSceneAR: 'MainSceneAR',
  DemoARPortal: 'DemoARPortal'
};

export const AppNavigator = StackNavigator(
{
    [ROUTES.login]: { screen: LoginForm },
    [ROUTES.rootstab]: { screen: RootsTab },
    [ROUTES.List]: { screen: List },
    [ROUTES.MainSceneAR]: { screen: MainSceneAR },
    [ROUTES.DemoARPortal]: { screen: DemoARPortal }
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
