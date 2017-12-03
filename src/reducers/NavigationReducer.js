import { NavigationActions } from 'react-navigation';
import { LOGIN, LIST_NAV } from '../actions/types';
import { routerInitialState, router, ROUTES } from '../AppNavigator';

export default (state = routerInitialState, action) => {
    let nextState = null;
    switch (action.type) {
        case LOGIN:
            nextState = router.getStateForAction(
                NavigationActions.navigate({ routeName: ROUTES.rootstab }),
                state
            );
            break;
        case LIST_NAV:
            nextState = router.getStateForAction(
                NavigationActions.navigate({ routeName: ROUTES.List }),
                state
            );
            break;
        default:
            nextState = router.getStateForAction(action, state);
            break;
    }
    return nextState || state;
};
