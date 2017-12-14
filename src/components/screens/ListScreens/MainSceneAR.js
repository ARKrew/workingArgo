import React, { Component } from 'react';
import DemoARPortal from './DemoARPortal';
import Modal from 'react-native-modal';
import BadgeAR from '../BadgeAR';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { ViroARSceneNavigator } from 'react-viro';
import {
  listNavigate,
  enterAR,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal,
  clickedObj
} from '../../../actions';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class MainSceneAR extends Component {

    constructor(props) {
      super(props);
      this.state = {
        sharedProps: sharedProps,
        visibleModal: true,
      };
      this.onExit.bind(this);
    }

    onExit = () => {
      this.props.enterAR({ enterAR: false });
    }

    exitAR = () => {
      // Update firebase
      const completedPortal = {};
      const key = this.props.map.selectedMarker.firebaseKey;

      completedPortal[key] = true;
      firebase.database().ref(`portals_completed/${this.props.user.uid}`).update(completedPortal);
      // Reset map state
      this.props.disableHunt({ isHunting: false, selectedMarker: null });
      this.props.indicateInsidePortal({ inPortal: false });
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

    _renderButton = (text, onPress) => {
      return (
        <TouchableOpacity onPress={this.exitAR}>
          <View style={styles.button}>
            <Text>Profile Page</Text>
          </View>
        </TouchableOpacity>
      );
    }

    _renderModalContent = () => (
      <View style={styles.modalContent}>
        <Text>Congrats on your first badge! Head to the Profile Page to view it!</Text>
        {this._renderButton('Profile Page', () => {
          this.setState({ visibleModal: false });
          })}
      </View>
    );

    render() {
      const isEnterAR = this.props.ARstate.enterAR;
      const isClickedObj = this.props.ARstate.clickedObj

      // Enter enterAR is true, open the portal
      if (isEnterAR) {
        return <BadgeAR />;
        // When enterAR is false, you are unmounting the portal
      } else {
        // If you click on the badge show the Exit modal and route you back to the Profile page
        if (isClickedObj) {
          return (
            <Modal
              isVisible={this.state.visibleModal}
              backdropOpacity={0.3}
              animationIn={'zoomInDown'}
              animationOut={'zoomOutUp'}
              animationInTiming={1000}
              animationOutTiming={1000}
              backdropTransitionInTiming={1000}
              backdropTransitionOutTiming={1000}
              useNativeDriver
            >
              {this._renderModalContent()}
            </Modal>
          );
        } return null;
      }
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
    bottom: 0,
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
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  }
});

const mapStateToProps = state => {
  return {
    ARstate: state.demoAR,
    navState: state.nav,
    currentRoute: state.nav.routes[1].index,
    badge: state.badge,
    map: state.map,
    user: state.auth.user
  };
};

export default connect(mapStateToProps, {
  listNavigate,
  enterAR,
  updateDisplayBadge,
  disableHunt,
  clickedObj,
  indicateInsidePortal
})(MainSceneAR);
