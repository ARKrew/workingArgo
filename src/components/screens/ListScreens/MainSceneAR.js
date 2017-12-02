import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';

import {
  ViroARSceneNavigator
} from 'react-viro';

const sharedProps = {
    apiKey:"D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443"
  }

  // Sets the default scene you want for AR and VR
  const demosceneAR = require('./DemoARPortal');
  // var DemoSceneAR = require('./js/DemoSceneAR');

  export default class MainSceneAR extends Component {
    constructor() {
      super();

      this.state = {
        sharedProps: sharedProps
      }

    }

    // Replace this function with the contents of _getDemoSceneARNavigator() or _getMainSceneARNavigator()
    // if you are building a specific type of experience.
    render() {
      console.log('hi');
      return (
      <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{ scene: demosceneAR }} />
    );
    }
}

  module.export = MainSceneAR;
