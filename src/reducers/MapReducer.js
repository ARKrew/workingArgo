import { 
  USER_POSITION_CHANGE, 
  MAP_REGION_CHANGE, 
  UPDATE_MARKERS,
  ERROR 
} from '../actions/types';

const INITIAL_STATE = {
  userPosition: null,
  mapRegion: null,
  markerPositions: null,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_POSITION_CHANGE: 
      return { ...state, ...action.payload };
    case MAP_REGION_CHANGE: 
      return { ...state, ...action.payload };
    case ERROR: 
      return { ...state, ...action.payload };
    case UPDATE_MARKERS:
      return { ...state, ...action.payload };
    default: 
      return state;
  }
};
