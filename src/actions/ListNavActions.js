import { NavigationActions } from 'react-navigation';
import { LIST_NAV } from './types';

export const listNavigate = () => {
    return (dispatch) => {
        dispatch({
            type: LIST_NAV,
            // payload: data
        });
        console.log(dispatch);
    };
};
