import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  Actions
} from 'react-native';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator
} from 'react-viro';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import DemoARPortal from './DemoARPortal';
import { listNavigate } from '../../../actions/ListNavActions';
// import { AppNavigator } from '../../../AppNavigator';
import ListNav from './ListNav';
import { routerInitialState, router, ROUTES } from '../../../AppNavigator';
import { Button } from '../../../components/common';

const sharedProps = {
    apiKey:"D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443"
  };

  class MainSceneAR extends Component {

    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
    }

    //
    exitAR = () => {
      // Reset to list screen from MainSceneAR
      this.props.navigation.navigate('List');
      this.props.listNavigate();
    }
    // Replace this function with the contents of _getDemoSceneARNavigator() or _getMainSceneARNavigator()
    // if you are building a specific type of experience.
    render() {
      console.log('+++++++ar+++++' + this.props.ARstate.enterAR);
    if (this.props.ARstate.enterAR === true) {
        return (
          <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{ scene: DemoARPortal }} />
        );
      }
        return (
          <TouchableOpacity >
            <Text style={{ color: "black", fontSize: 22, marginTop: 35, fontFamily: 'Lato-Regular' }}>
              Congrats you picked up your first badge!
              Now head to your Profile Page to see your new badge!
            </Text>
            <Button onPress={this.exitAR}>Profile Page</Button>
        </TouchableOpacity>
        );
    }
}

const mapStateToProps = state => {
  return {
    ARstate: state.demoAR,
    navState: state.nav,
    currentRoute: state.nav.routes[1].index
  };
};

export default connect(mapStateToProps, { listNavigate })(MainSceneAR);

  // module.export = MainSceneAR;
