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
        source={require('../assets/icons/027-skull-1.png')}
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
        source={require('../assets/icons/042-treasure-map.png')}
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
        source={require('../assets/icons/030-scroll.png')}
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
        source={require('../assets/icons/013-helm.png')}
        style={[styles.icon]}
      />
    ),
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: '#f37a81',
    fontFamily: 'Lato-Regular',
  }
},
{
  lazy: true,
});

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

export default RootsTab;
