import { StackNavigator } from 'react-navigation';
import More from '../More';
import TermsOfService from './TermsOfService';
import About from './About';

const MoreNav = StackNavigator({
  More: {
    screen: More,
  },
  TermsOfService: {
    screen: TermsOfService,
  },
  About: {
    screen: About,
  }
  }, 
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default MoreNav;
