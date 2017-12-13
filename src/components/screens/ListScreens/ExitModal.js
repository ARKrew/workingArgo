import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';
import DemoARPortal from './DemoARPortal';
import BadgeAR from '../BadgeAR';
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
  clickedObj,
  enterAR,
  updateDisplayBadge,
  disableHunt
} from '../../../actions';
import { routerInitialState, router, ROUTES } from '../../../AppNavigator';

const sharedProps = {
    apiKey: 'D5FCCB74-1B13-4E50-BCE8-3DAE6B9ED443'
  };


// const navigateAction = NavigationActions.navigate({
//   routeName: 'Profile',
//   params: {},
//   // navigate can have a nested navigate action that will be run inside the child router
//   action: NavigationActions.navigate({ routeName: 'Profile' })
// });

  class ExitModal extends Component {

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
      // const { navigation } = this.props;
      // Reset to list screen from MainSceneAR
      // navigation(navigateAction);
      // this.props.rootNavigation.navigation.dispatch('List');
      this.props.listNavigate();
      this.props.disableHunt({ isHunting: false, selectedMarker: null });
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
    if (this.props.ARstate.clickedObj === true) {
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
      //   <View style={styles.container}>
      //       <Text style={styles.badgeText}>
      //         Congrats on your first badge!
      //       </Text>
      //       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      //         {this.renderDisplayBadge()}
      //       </View>
      //       <Text style={styles.badgeText}>
      //         Now head to your Profile Page to see your new badge!
      //       </Text>
      //       <TouchableHighlight>
      //         <Text style={styles.profileButton} onPress={this.exitAR}>Profile Page</Text>
      //       </TouchableHighlight>
      // </View>
    );
  } return null;
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
    badge: state.badge
  };
};

export default connect(mapStateToProps, {
  listNavigate,
  enterAR,
  clickedObj,
  updateDisplayBadge,
  disableHunt
})(ExitModal);
