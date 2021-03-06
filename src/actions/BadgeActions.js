import { 
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES,
  AVAILABLE_BADGES
} from './types';
  
export const updateDisplayBadge = data => (
  {
    type: CURRENT_DISPLAY_BADGE,
    payload: data
  }
);

export const updateProfileBadges = data => (
  {
    type: ARRAY_OF_COLLECTED_BADGES,
    payload: data
  }
);

export const updateAvailableBadges = data => (
  {
    type: AVAILABLE_BADGES,
    payload: data
  }
);
