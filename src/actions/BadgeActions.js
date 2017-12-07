import { 
  CURRENT_DISPLAY_BADGE,
  ARRAY_OF_COLLECTED_BADGES
} from './types';
  
export const displayBadge = data => (
  {
    type: CURRENT_DISPLAY_BADGE,
    payload: data
  }
);

export const userBadgeArray = data => (
  {
    type: ARRAY_OF_COLLECTED_BADGES,
    payload: data
  }
);
