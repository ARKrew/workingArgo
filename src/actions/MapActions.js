import { 
  USER_POSITION_CHANGE, 
  MAP_REGION_CHANGE, 
  ERROR 
} from './types';

export const updateUserPosition = data => (
  {
    type: USER_POSITION_CHANGE,
    payload: data
  }
);

export const updateMapRegion = data => (
  {
    type: MAP_REGION_CHANGE,
    payload: data
  }
);

export const errorMessage = error => (
  {
    type: ERROR,
    payload: error
  }
);
