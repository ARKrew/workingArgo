import {
  ENTER_AR,
  ENTER_AR_TUTORIAL,
  CLICKED_OBJ
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

export const clickedObj = data => (
  {
    type: CLICKED_OBJ,
    payload: data
  }
);
