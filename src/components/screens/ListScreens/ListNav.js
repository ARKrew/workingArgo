import { StackNavigator } from 'react-navigation';
import List from '../List';
import ARPortal from './ARPortal';
import DemoARPortal from './DemoARPortal';
import MainSceneAR from './MainSceneAR';

const ListNav = StackNavigator(
  {
    List: {
      screen: List
    },
    ARPortal: {
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
