import { StackNavigator } from 'react-navigation';
import More from '../More';
import TermsOfService from './TermsOfService';
import HelpAndAbout from './HelpAndAbout';

const MoreNav = StackNavigator({
  More: {
    screen: More,
  },
  TermsOfService: {
    screen: TermsOfService,
  },
  HelpAndAbout: {
    screen: HelpAndAbout,
  }
  }, 
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default MoreNav;
