import { 
  USER_POSITION_CHANGE,
  MAP_REGION_CHANGE,
  UPDATE_MARKERS,
  UPDATE_MARKER_INDEX,
  INITIALIZE_HUNT
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

export const updateMarkerIndex = data => (
  {
    type: UPDATE_MARKER_INDEX,
    payload: data
  }
);

export const initializeHunt = data => (
  {
    type: INITIALIZE_HUNT,
    payload: data
  }
)
