import {
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES,
  AVAILABLE_BADGES,
  LOGOUT
} from '../actions/types';

import { profileBadges } from '../constants';

const INITIAL_STATE = {
  availableBadges: profileBadges,
  displayBadge: {
    fileName: '009-pirate-1.png',
    image: require('./../assets/icons/009-pirate-1.png')
  },
  collectedBadges: [],
  // profileBadges: [],
  // colorBadges: profileBadges,
  // greyBadges: profileBadgesGreyScale
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_DISPLAY_BADGE:
      return { ...state, ...action.payload };
    case ARRAY_OF_COLLECTED_BADGES:
      return { ...state, ...action.payload };
    case AVAILABLE_BADGES:
      return { ...state, ...action.payload };
    case LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
