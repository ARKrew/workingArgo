import { StackNavigator } from 'react-navigation';
import LoginForm from './components/LoginForm';
import RootsTab from './components/RootsTab';

export const ROUTES = {
  login: 'LoginForm',
  rootstab: 'RootsTab'
};

export const AppNavigator = StackNavigator({
    [ROUTES.login]: { screen: LoginForm },
    [ROUTES.rootstab]: { screen: RootsTab }
}, {
    cardStyle: {
        backgroundColor: '#fff'
    },
});

export const { router } = AppNavigator;
export const routerInitialState = router.getStateForAction(
    router.getActionForPathAndParams(ROUTES.login)
);
