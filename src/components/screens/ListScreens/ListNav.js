import { StackNavigator } from 'react-navigation';
import List from '../List';
import DemoARPortal from './DemoARPortal';
import MainSceneAR from './MainSceneAR';
import TutorialAR from '../TutorialAR';

const ListNav = StackNavigator(
  {
    List: {
      screen: List
    },
    MainSceneAR: {
      // screen: ARPortal
      screen: MainSceneAR
    },
    DemoARPortal: {
      screen: DemoARPortal
    },
    TutorialAR: {
      screen: TutorialAR
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'

  }
);

export default ListNav;
