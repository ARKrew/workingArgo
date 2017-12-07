import { 
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES
} from '../actions/types';

import profileBadges from './profileBadges.js';

const INITIAL_STATE = {
  displayBadge: '',
  collectedBadges: profileBadges
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_DISPLAY_BADGE: 
      return { ...state, ...action.payload };
    case ARRAY_OF_COLLECTED_BADGES:
      return { ...state, ...action.payload };
    default: 
      return state;
  }
};
