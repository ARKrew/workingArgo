import {
  ENTER_AR, 
  ENTER_AR_TUTORIAL,
} from './types';

export const enterAR = data => (
  {
    type: ENTER_AR,
    payload: data
  }
);

export const enterARTutorial = data => (
  {
    type: ENTER_AR_TUTORIAL,
    payload: data
  }
);
