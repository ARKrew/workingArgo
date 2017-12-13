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
import { 
  NavigationActions, 
  addNavigationHelpers 
} from 'react-navigation';
import TutorialSceneAR from '../ar/TutorialSceneAR';
import { listNavigate } from '../../actions/ListNavActions';
// import ListNav from './ListNav';
import { 
  routerInitialState, 
  router, 
  ROUTES 
} from '../../AppNavigator';
import { Button } from '../../components/common';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class TutorialAR extends Component {

    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
    }

    //
    exitAR = () => {
      // Reset to list screen from TutorialAR
      this.props.navigation.navigate('List');
      this.props.listNavigate();
    }
    // Replace this function with the contents of _getDemoSceneARNavigator() or _getTutorialARNavigator()
    // if you are building a specific type of experience.
    render() {
      console.log('+++++++ar+++++' + this.props.ARstate.enterARTutorial);
    if (this.props.ARstate.enterARTutorial === true) {
        return (
          <ViroARSceneNavigator {...this.state.sharedProps} initialScene={{ scene: TutorialSceneAR }} />
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

export default connect(mapStateToProps, { listNavigate })(TutorialAR);

  // module.export = TutorialAR;
