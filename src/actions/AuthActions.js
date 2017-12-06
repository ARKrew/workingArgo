import { LOGIN, LOGOUT } from './types';

export const loginSuccess = (user) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN,
            payload: user
        });
    };
};

export const logOut = () => {
  return (dispatch) => {
    dispatch({
      type: LOGOUT
        });
  };
};
