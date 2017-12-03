import {
  ENTER_AR,
} from '../actions/types';

const INITIAL_STATE = {
  enterAR: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ENTER_AR:
      return { ...state, ...action.payload };


    default:
      return state;
  }
};
