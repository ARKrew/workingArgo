import { LIST_NAV } from './types';

export const listNavigate = () => {
    // type: LIST_NAV,
    return (dispatch) => {
        dispatch({
            type: LIST_NAV,
        });
    };
};
