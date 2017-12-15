import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { ViroARSceneNavigator } from 'react-viro';
import {
  listNavigate,
  enterARTutorial,
  clickedObj,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal
} from '../../actions';
// import DemoARPortal from './ListScreens/DemoARPortal';
import TutorialSceneAR from '../ar/TutorialSceneAR';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class TutorialNavAR extends Component {

    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
      this.goBack.bind(this);
    }

    componentWillUnmount() {
      console.log("TutorialNavAR UNMOUNTED ASDFASDFLKAGSEJLAJWKELGKA");
    }

    // onExit = () => {
    //   this.props.enterARTutorial({ enterARTutorial: false });
    //   this.props.clickedObj({ clickedObj: false });
    //   // this.props.disableHunt({ isHunting: false, selectedMarker: null });
    // }

    goBack = () => {
      this.props.enterARTutorial({ enterARTutorial: false });
      this.props.clickedObj({ clickedObj: false });
      // Reset map state
      this.props.disableHunt({ isHunting: false, selectedMarker: null });
      this.props.indicateInsidePortal({ inPortal: false });
      // Reset to Profile
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

    // Replace this function with the contents of _getDemoSceneARNavigator() or _getTutorialNavARNavigator()
    // if you are building a specific type of experience.
    render() {
    if (this.props.ARstate.enterARTutorial === true) {
        return (
          <View style={styles.outer} >
            <ViroARSceneNavigator style={styles.arView} {...this.state.sharedProps} initialScene={{ scene: TutorialSceneAR }} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttons}
                  onPress={this.goBack}
                  underlayColor={'#00000000'} >
                  <Image
                    style={styles.buttonImage}
                    source={require('../../assets/models/button/icon_arrow.png')} />
                </TouchableOpacity>
              </View>
          </View>
        );
      }
      return null;
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    left: 10,
    top: 20,
    alignItems: 'flex-start',
    height: 10,
    width: 10
  },
  buttons: {
    maxHeight: 10,
    backgroundColor: '#00000000',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#ffffff00',
  },
  buttonImage: {
    height: 50,
    width: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f37a81'
  },
  profileButton: {
    top: 5,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
    color: '#C8243B',
  },
  badgeText: {
    bottom: 10,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Lato-Regular'
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
  enterARTutorial,
  clickedObj,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal
})(TutorialNavAR);
