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
  enterAR,
  clickedObj,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal
} from '../../actions';
// import DemoARPortal from './ListScreens/DemoARPortal';
import BadgePortalAR from '../ar/BadgePortalAR';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class BadgeAR extends Component {

    constructor() {
      super();
      this.state = {
        sharedProps: sharedProps,
      };
      this.goBack.bind(this);
    }

    componentWillUnmount() {
      console.log("BadgeAR UNMOUNTED ASDFASDFLKAGSEJLAJWKELGKA");
    }

    // onExit = () => {
    //   this.props.enterAR({ enterAR: false });
    //   this.props.clickedObj({ clickedObj: false });
    //   // this.props.disableHunt({ isHunting: false, selectedMarker: null });
    // }

    goBack = () => {
      this.props.enterAR({ enterAR: false });
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

    // Replace this function with the contents of _getDemoSceneARNavigator() or _getBadgeARNavigator()
    // if you are building a specific type of experience.
    render() {
    if (this.props.ARstate.enterAR === true) {
        return (
          <View style={styles.outer} >
            <ViroARSceneNavigator style={styles.arView} {...this.state.sharedProps} initialScene={{ scene: BadgePortalAR }} />
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
    bottom: 50,
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
  enterAR,
  clickedObj,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal
})(BadgeAR);
