import { NavigationActions } from 'react-navigation';
import { LOGIN } from '../actions/types';
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
        default:
            nextState = router.getStateForAction(action, state);
            break;
    }
    return nextState || state;
};
