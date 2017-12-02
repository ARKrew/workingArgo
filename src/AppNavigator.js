import { StackNavigator } from 'react-navigation';
import LoginForm from './components/LoginForm';
import RootsTab from './components/RootsTab';
import DemoARPortal from './components/screens/ListScreens/MainSceneAR';

export const ROUTES = {
  login: 'LoginForm',
  rootstab: 'RootsTab',
  demoAR: 'DemoARPortal'
};

export const AppNavigator = StackNavigator({
    [ROUTES.login]: { screen: LoginForm },
    [ROUTES.rootstab]: { screen: RootsTab },
    [ROUTES.demoAR]: { screen: DemoARPortal }
}, {
    cardStyle: {
        backgroundColor: '#fff'
    },
});

export const { router } = AppNavigator;
export const routerInitialState = router.getStateForAction(
    router.getActionForPathAndParams(ROUTES.login)
);
