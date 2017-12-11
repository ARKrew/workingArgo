import { 
  USER_POSITION_CHANGE, 
  MAP_REGION_CHANGE, 
  UPDATE_MARKERS,
  UPDATE_MARKER_INDEX,
  INITIALIZE_HUNT
} from '../actions/types';

const INITIAL_STATE = {
  userPosition: null,
  mapRegion: null,
  markers: null,
  markerIndex: null,
  isHunting: null,
  selectedMarker: null,
  scroll: false
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
    default: 
      return state;
  }
};
