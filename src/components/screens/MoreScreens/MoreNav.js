import { StackNavigator } from 'react-navigation';
import More from '../More';
import TermsOfService from './TermsOfService';
import About from './About';
import Contact from './Contact';

const MoreNav = StackNavigator({
  More: {
    screen: More,
  },
  TermsOfService: {
    screen: TermsOfService,
  },
  About: {
    screen: About,
  },
  Contact: {
    screen: Contact,
  }
  }, 
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default MoreNav;
