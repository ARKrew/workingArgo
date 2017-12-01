import { NavigationActions } from 'react-navigation';
import { LOGIN } from './types';

export const loginSuccess = ({ user }) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN,
            payload: user
        });
        console.log(dispatch);
    };
};

// export const logout = () => {
//     return (dispatch) => {
//         dispatch({
//             type: LOGOUT,
//         });
//         const resetNavigator = NavigationActions.reset({
//             index: 0,
//             actions: [
//                 NavigationActions.navigate({
//                     routeName: 'Unauthorized',
//                 })
//             ],
//         });
//         dispatch(resetNavigator);
//     };
// };
