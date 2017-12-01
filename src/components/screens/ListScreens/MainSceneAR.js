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
  ViroSceneNavigator,
  ViroARSceneNavigator
} from 'react-viro';

var sharedProps = {
    apiKey:"D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443",
  }
  
  // Sets the default scene you want for AR and VR
  var HelloWorldSceneAR = require('../../../js/HelloWorldSceneAR');
  // var DemoSceneAR = require('./js/DemoSceneAR');
  
  export default class MainSceneAR extends Component {
    constructor() {
      super();
  
      this.state = {
        navigatorType : defaultNavigatorType,
        sharedProps : sharedProps
      }
  
    }
  
    // Replace this function with the contents of _getDemoSceneARNavigator() or _getMainSceneARNavigator()
    // if you are building a specific type of experience.
    render() {
      <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{scene: HelloWorldSceneAR}} />
    }
  }
  
  module.exports = MainSceneAR
  