import {
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES,
  AVAILABLE_BADGES
} from '../actions/types';

import profileBadges from '../constants/profileBadges';
import profileBadgesGreyScale from '../constants/profileBadgesGreyScale';

const INITIAL_STATE = {
  availableBadges: profileBadges,
  displayBadge: {
    fileName: '006-coin.png',
    image: require('./../assets/icons/006-coin.png')
  },
  collectedBadges: ['001-parrot.png', '002-pirate-hat.png', '003-anchor.png'],
  profileBadges: [],
  colorBadges: profileBadges,
  greyBadges: profileBadgesGreyScale
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_DISPLAY_BADGE:
    {
      const selectedBadge = profileBadges.filter((badge) => {
        return (badge.fileName === action.payload.displayBadge);
      });
      return { ...state, displayBadge: selectedBadge[0] };
    }
      return { ...state, ...action.payload };
    case ARRAY_OF_COLLECTED_BADGES:
      return { ...state, ...action.payload };
    case AVAILABLE_BADGES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
