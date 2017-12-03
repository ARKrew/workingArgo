import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import {
  ViroARSceneNavigator
} from 'react-viro';
import { NavigationActions } from 'react-navigation';
import { List, ROUTES } from './ListNAV';

const sharedProps = {
    apiKey:"D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443"
  }

  // Sets the default scene you want for AR and VR
  // const demosceneAR = require('./DemoARPortal');
  // var DemoSceneAR = require('./js/DemoSceneAR');
  import DemoARPortal from './DemoARPortal';

const navigateAction = NavigationActions.navigate({
  routeName: ROUTES.List,
});

  class MainSceneAR extends Component {
    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
    }

    // Replace this function with the contents of _getDemoSceneARNavigator() or _getMainSceneARNavigator()
    // if you are building a specific type of experience.
    render() {
      console.log('+++++++ar+++++' + this.props.ARstate.enterAR);
      console.log(this.state.sharedProps);
    if (this.props.ARstate.enterAR === true) {
        return (
          <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{ scene: DemoARPortal }} />
        );
    }
    return this.props.navigation.dispatch(navigateAction);
  }
}

const mapStateToProps = state => ({ ARstate: state.demoAR });
export default connect(mapStateToProps)(MainSceneAR);

  // module.export = MainSceneAR;
