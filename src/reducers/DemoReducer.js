import {
  ENTER_AR,
  ENTER_AR_TUTORIAL
} from '../actions/types';

const INITIAL_STATE = {
  enterAR: false,
  enterARTutorial: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ENTER_AR:
      return { ...state, ...action.payload };
    case ENTER_AR_TUTORIAL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
