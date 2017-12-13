import React, { Component } from 'react';
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
import firebase from 'firebase';
import { connect } from 'react-redux';
import { ViroARSceneNavigator } from 'react-viro';
import {
  listNavigate,
  enterAR,
  updateDisplayBadge,
  disableHunt,
  indicateInsidePortal
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

    render() {
    if (this.props.ARstate.enterAR === true) {
        return (
           <BadgeAR />
        );
      }
        return (
          <View style={styles.container}>
              <Text style={styles.badgeText}>
                Congrats on your first badge!
              </Text>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {this.renderDisplayBadge()}
              </View>
              <Text style={styles.badgeText}>
                Now head to your Profile Page to see your new badge!
              </Text>
              <TouchableHighlight>
                <Text style={styles.profileButton} onPress={this.exitAR}>Profile Page</Text>
              </TouchableHighlight>
        </View>
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
  indicateInsidePortal
})(MainSceneAR);
