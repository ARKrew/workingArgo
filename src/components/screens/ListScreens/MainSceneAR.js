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

const sharedProps = {
    apiKey:"D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443"
  }

  // Sets the default scene you want for AR and VR
  const demosceneAR = require('./DemoARPortal');
  // var DemoSceneAR = require('./js/DemoSceneAR');

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
      if (this.props.ARstate.enterAR === true) {
        return (
          <View>
            <Text>Hi</Text>
          </View>
        );
        // return (
        //   <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{ scene: demosceneAR }} />
        // );
    }
    return null;
  }
}

const mapStateToProps = state => ({ ARstate: state.demoAR });
export default connect(mapStateToProps)(MainSceneAR);

  // module.export = MainSceneAR;
