import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  Actions,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { ViroARSceneNavigator } from 'react-viro';
import { 
  NavigationActions, 
  addNavigationHelpers 
} from 'react-navigation';
import DemoARPortal from './DemoARPortal';
// import { AppNavigator } from '../../../AppNavigator';
import ListNav from './ListNav';
import { 
  routerInitialState, 
  router, 
  ROUTES 
} from '../../../AppNavigator';
import { Button } from '../../../components/common';
import { 
  listNavigate, 
  enterAR, 
  updateDisplayBadge 
} from '../../../actions';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class MainSceneAR extends Component {

    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
      this.onExit.bind(this);
    }

    onExit = () => {
      this.props.enterAR({ enterAR: false }); 
    }

    exitAR = () => {
      // Reset to list screen from MainSceneAR
      this.props.navigation.navigate('List');
      this.props.listNavigate();
    }

    renderDisplayBadge() {
      return (
        <Image
        style={styles.badge}
        key={this.props.badge.displayBadge.fileName}
        source={this.props.badge.displayBadge.image}
        />
      );
    }

    // Replace this function with the contents of _getDemoSceneARNavigator() or _getMainSceneARNavigator()
    // if you are building a specific type of experience.
    render() {
      console.log('+++++++ar+++++' + this.props.ARstate.enterAR);
    if (this.props.ARstate.enterAR === true) {
        return (
          <View style={styles.outer} >
            <ViroARSceneNavigator style={styles.arView} {...this.state.sharedProps} initialScene={{ scene: DemoARPortal }} />
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 77, alignItems: 'center' }}>
                <TouchableHighlight 
                  style={styles.buttons} 
                  onPress={this.onExit}
                  underlayColor={'#00000000'} 
                >
                  <Image source={require('../../../assets/models/button/icon_close.png')} />
                </TouchableHighlight>
              </View>
          </View>
        );
      }
        return (
          <TouchableOpacity >
            <Text style={{ color: 'black', fontSize: 22, marginTop: 35, fontFamily: 'Lato-Regular' }}>
              Congrats you picked up your first badge!
              Now head to your Profile Page to see your new badge!
            </Text>
            <Button onPress={this.exitAR}>Profile Page</Button>
            {this.renderDisplayBadge()}
        </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  buttons: {
    height: 80,
    width: 80,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#00000000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff00',
  },
  badge: {
    width: 70,
    height: 70,
    margin: 5
  }
});

const mapStateToProps = state => {
  return {
    ARstate: state.demoAR,
    navState: state.nav,
    currentRoute: state.nav.routes[1].index,
    badge: state.badge
  };
};

export default connect(mapStateToProps, { 
  listNavigate, 
  enterAR,
  updateDisplayBadge
})(MainSceneAR);
