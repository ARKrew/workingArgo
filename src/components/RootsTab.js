import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Profile from './screens/Profile';
import MoreNav from './screens/MoreScreens/MoreNav';
import Map from './screens/Map';
import ListNav from './screens/ListScreens/ListNav';

const ProfileScreen = () => (
  <Profile />
);

const MapScreen = () => (
  <Map />
);

const ListScreen = () => (
  <ListNav />
);

const MoreScreen = () => (
  <MoreNav />
);

const RootsTab = TabNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      tabBarIcon: () => (
      <Image
        source={require('../img/icons/skull.png')}
        style={[styles.icon]}
      />
    ),
    }
  },
  Map: {
    screen: MapScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      tabBarIcon: () => (
      <Image
        source={require('../img/icons/treasure-map.png')}
        style={[styles.icon]}
      />
    ),
    }
  },
  List: {
    screen: ListScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      tabBarIcon: () => (
      <Image
        source={require('../img/icons/scroll.png')}
        style={[styles.icon]}
      />
    ),
    }
  },
  More: {
    screen: MoreScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      tabBarIcon: () => (
      <Image
        source={require('../img/icons/helm.png')}
        style={[styles.icon]}
      />
    ),
    }
  }
},
{
  lazy: true
});

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

export default RootsTab;
