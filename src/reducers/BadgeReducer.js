import { 
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES
} from '../actions/types';

import profileBadges from '../constants/profileBadges';
import profileBadgesGreyScale from '../constants/profileBadgesGreyScale';

const INITIAL_STATE = {
  displayBadge: {
    fileName: '043-compass-1.png',
    image: require('./../assets/icons/043-compass-1.png')
  },
  collectedBadges: profileBadgesGreyScale
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_DISPLAY_BADGE: {
      const selectedBadge = profileBadges.filter((badge) => {
        return (badge.fileName === action.payload.displayBadge);
      });
      return { ...state, displayBadge: selectedBadge[0] };
    }
    case ARRAY_OF_COLLECTED_BADGES:
      return { ...state, ...action.payload };
    default: 
      return state;
  }
};
