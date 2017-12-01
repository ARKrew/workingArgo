import { StackNavigator } from 'react-navigation';
import More from '../More';
import TermsOfService from './TermsOfService';
import HelpAndAbout from './HelpAndAbout';
import LogOut from './LogOut';

const MoreNav = StackNavigator({
  More: { 
    screen: More,
  },
  TermsOfService: {
    screen: TermsOfService,
  },
  HelpAndAbout: {
    screen: HelpAndAbout,
  },
  LogOut: {
    screen: LogOut,
  }
  }, 
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default MoreNav;
