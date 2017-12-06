import { 
  USER_POSITION_CHANGE,
  MAP_REGION_CHANGE,
  UPDATE_MARKERS,
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

export const updateMarkers = data => (
  {
    type: UPDATE_MARKERS,
    payload: data
  }
);

export const errorMessage = error => (
  {
    type: ERROR,
    payload: error
  }
);
