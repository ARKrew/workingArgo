import { StackNavigator } from 'react-navigation';
import More from '../More';
import TermsOfService from './TermsOfService';
import About from './About';
import FAQs from './FAQs';

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
  FAQs: {
    screen: FAQs,
  }
  }, 
  {
    mode: 'modal',
    headerMode: 'none',
    transitionConfig: () => ({
     transitionSpec: {
       duration: 500
     }
    })
  }
);

export default MoreNav;
