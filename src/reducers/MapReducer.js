import { 
  USER_POSITION_CHANGE, 
  MAP_REGION_CHANGE, 
  UPDATE_MARKERS,
  UPDATE_MARKER_INDEX,
  INITIALIZE_HUNT,
  DISABLE_HUNT,
  INSIDE_PORTAL,
  UPDATE_GESTURE,
  LOGOUT
} from '../actions/types';

const INITIAL_STATE = {
  userPosition: null,
  mapRegion: null,
  markers: null,
  markerIndex: null,
  isHunting: null,
  selectedMarker: null,
  scroll: false,
  enablePortal: null,
  gestureEnabled: null,
  inPortal: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_POSITION_CHANGE: 
      return { ...state, ...action.payload };
    case MAP_REGION_CHANGE: 
      return { ...state, ...action.payload };
    case UPDATE_MARKERS:
      return { ...state, ...action.payload };
    case UPDATE_MARKER_INDEX:
      return { ...state, ...action.payload };
    case INITIALIZE_HUNT:
      return { ...state, ...action.payload };
    case DISABLE_HUNT:
      return { ...state, ...action.payload };
    case INSIDE_PORTAL: 
      return { ...state, ...action.payload };
    case UPDATE_GESTURE:
      return { ...state, ...action.payload };
    case LOGOUT:
      return INITIAL_STATE;
    default: 
      return state;
  }
};
