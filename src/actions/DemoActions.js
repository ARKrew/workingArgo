import {
  ENTER_AR,
} from './types';

export const enterAR = data => (
  {
    type: ENTER_AR,
    payload: data
  }
);
