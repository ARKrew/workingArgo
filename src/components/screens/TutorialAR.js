import React, { Component } from 'react';
import Modal from 'react-native-modal';
import TutorialNavAR from '../ar/TutorialNavAR';
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
  enterARTutorial,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal,
  clickedObj
} from '../../actions';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };

  class TutorialAR extends Component {

    constructor(props) {
      super(props);
      this.state = {
        sharedProps: sharedProps,
        visibleModal: true,
      };
      this.onExit.bind(this);
    }

    onExit = () => {
      this.props.enterARTutorial({ enterARTutorial: false });
    }

    exitAR = () => {
      this.props.indicateInsidePortal({ inPortal: false });
      this.props.navigation.navigate('List');
      this.props.listNavigate();
    }

    renderDisplayBadge() {
      return (
        <Image
        style={styles.badge}
        source={require('../../assets/icons/006-coin.png')}
        />
      );
    }

    _renderButton = (text, onPress) => {
      return (
        <TouchableOpacity onPress={this.exitAR}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Profile Page</Text>
          </View>
        </TouchableOpacity>
      );
    }

    _renderModalContent = () => (
      <View style={styles.modalContent}>
        {this.renderDisplayBadge()}
        <Text style={styles.modalText}>
          Congrats! You've completed training.
          {'\n'}
          Captain {this.props.user.last_name}...
          {'\n'}
          {/* <Text style={styles.modalTextBadge}>{this.props.currentBadge.title}</Text>! 
          {'\n'} */}
          Travel the world and seek fortune!
        </Text>
        {this._renderButton('Profile Page', () => {
          this.setState({ visibleModal: false });
          })}
      </View>
    );

    render() {
      const isenterARTutorial = this.props.ARstate.enterARTutorial;
      const isClickedObj = this.props.ARstate.clickedObj;

      if (isenterARTutorial) {
        return <TutorialNavAR />;
      } else {
        if (isClickedObj) {
          return (
            <Modal
              style={{ backgroundColor: '#f37a81' }}
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
    backgroundColor: '#C8243B',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontFamily: 'Lato-Regular'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    textAlignVertical: 'center', 
    textAlign: 'center', 
    fontFamily: 'Lato-Regular'
  },
  modalTextBadge: {
    color: '#C8243B', 
    fontWeight: 'bold', 
    fontFamily: 'Lato-Regular'
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
    currentBadge: state.badge.displayBadge,
    map: state.map,
    user: state.auth.user
  };
};

export default connect(mapStateToProps, {
  listNavigate,
  enterARTutorial,
  updateDisplayBadge,
  disableHunt,
  clickedObj,
  indicateInsidePortal
})(TutorialAR);
