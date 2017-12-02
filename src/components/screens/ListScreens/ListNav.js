import { StackNavigator } from 'react-navigation';
import List from '../List';
import DemoARPortal from './DemoARPortal';
import MainSceneAR from './MainSceneAR';

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
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'

  }
);

export default ListNav;
