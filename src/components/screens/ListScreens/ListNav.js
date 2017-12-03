import { StackNavigator } from 'react-navigation';
import List from '../List';
import DemoARPortal from './DemoARPortal';
import MainSceneAR from './MainSceneAR';

export const ROUTES = {
  List: 'List',
  MainSceneAR: 'MainSceneAR',
  DemoARPortal: 'DemoARPortal'
};

const ListNav = StackNavigator(
  {
    [ROUTES.List]: {
      screen: List
    },
    [ROUTES.MainSceneAR]: {
      // screen: ARPortal
      screen: MainSceneAR
    },
    [ROUTES.DemoARPortal]: {
      screen: DemoARPortal
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'

  }
);

export default ListNav;
