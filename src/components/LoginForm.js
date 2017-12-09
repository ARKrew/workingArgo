import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableHighlight,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { loginSuccess, updateAvailableBadges, updateProfileBadges } from '../actions';

const FBSDK = require('react-native-fbsdk');
// const pirateImg = require('../assets/images/pirate.png');
const pirateShipGIF = require('../assets/images/pirate_ship.gif');
const FBLogo = require('../assets/images/FB-f-Logo__white_144.png');

const { LoginButton, LoginManager, AccessToken } = FBSDK;

class Login extends Component {
  constructor(props) {
   super(props);
   this.state = {
     showSpinner: true,
    };
    this.authenticatedUser = false;
    this.setInitialBadgeState.bind(this);
  }

  componentDidMount() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged(auth => {
      if (auth && !this.authenticatedUser) {
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val();

          if (user != null) {
            const joinDate = firebase.auth().currentUser.metadata.creationTime.split(' ').slice(1, -2).join(' ');
            const displayName = firebase.auth().currentUser.displayName;

            this.authenticatedUser = true;
            this.firebaseRef.child(auth.uid).off('value');
            this.props.loginSuccess({ ...user, joinDate, displayName });
            this.setInitialBadgeState(user.collectedBadges);

            this.getCurrentLocation(user);
          }
        });
      } else {
        this.setState({ showSpinner: false });
      }
    });
  }

  onPressLogin() {
    this.setState({ showSpinner: true });
        LoginManager.logInWithReadPermissions([
          'public_profile',
          'user_birthday',
          'email',
          'user_photos'
        ])
        .then(result => this.handleCallBack(result),
          error => {
            const errorMessage = `Login fail with error: ${error}`;

            this.alertError(errorMessage);
          }
        );
  }

  getCurrentLocation({ uid }) {
    if (uid) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentLocation =
            [
              position.coords.latitude,
              position.coords.longitude
            ];

            if (currentLocation.length > 0) {
              firebase.database().ref('current_location').child(uid)
              .update({ currentLocation });
            } else {
              const errorMessage = 'Could not get Current Location';

              this.alertError(errorMessage);
            }
        },
        error => this.alertError(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }
  }

  handleCallBack(result) {
    const that = this;

    if (result.isCancelled) {
      const errorMessage = 'Login canceled';

      this.alertError(errorMessage);
    } else {
          AccessToken.getCurrentAccessToken().then(
          data => {
            const token = data.accessToken;
            const accessURL = `https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name&access_token=${token}`;

            fetch(accessURL)
            .then(response => response.json())
            .then(json => {
              const imageSize = 120;
              const facebookID = json.id;
              const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`;

             this.authenticate(data.accessToken)
              .then(res => {
                const { uid } = res;

                that.createUser(uid, json, token, fbImage);
              });
            })
            .catch(err => this.alertError(err.message)
            );
          }
        );
      }
  }

  setInitialBadgeState(badges) {
    // Need to set up collected badges from firebase
    const collectedBadges = badges ? collectedBadges : [];
    this.props.updateProfileBadges({ collectedBadges });
    const availableBadges = this.props.badges.availableBadges.filter(badge => collectedBadges.indexOf(badge) === -1);
    
    this.props.updateAvailableBadges({ availableBadges });
  }

  alertError(errorMessage) {
    Alert.alert(
      'Error Occurred',
      errorMessage,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  }

  authenticate(token) {
    const provider = firebase.auth.FacebookAuthProvider;
    const credential = provider.credential(token);

    return firebase.auth().signInWithCredential(credential);
  }

  createUser(uid, userData, token, dp) {
    const defaults = {
      uid,
      token,
      dp
    };

    firebase.database().ref('users').child(uid)
      .update({ ...userData, ...defaults });
  }

  render() {
    return (
      this.state.showSpinner ? <View style={styles.spinner}>
      <ActivityIndicator animating={this.state.showSpinner} /></View> :
      <View style={{ flex: 1, backgroundColor: '#f37a81' }}>
          <View style={styles.container}>
            <ImageBackground
              style={{ flex: 1, justifyContent: 'center' }}
              source={pirateShipGIF}
            >
            <Text style={styles.titleFont}>
              ARgo
            </Text>
              <TouchableHighlight
                style={styles.container2}
                onPress={this.onPressLogin.bind(this)}
                underlayColor='transparent'
              >
                <View style={styles.FBLoginButton}>
                  <Image style={styles.FBLogo} source={FBLogo} />
                  <Text style={styles.FBLoginButtonText}
                    numberOfLines={1}>Continue with Facebook</Text>
                </View>
              </TouchableHighlight>
              </ImageBackground>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '80%'
  },
  titleFont: {
    backgroundColor: 'transparent',
    fontFamily: 'IM Fell English',
    fontStyle: 'italic',
    fontSize: 45,
    textAlign: 'center',
    paddingTop: 375,
    margin: 20,
    color: '#FFFFFF'
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FBLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 200,
    paddingLeft: 2,
    backgroundColor: 'rgb(66,93,174)',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: 'rgb(66,93,174)',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Helvetica neue',
    fontSize: 14.2,
    marginLeft: 18,
  },
  FBLogo: {
    position: 'absolute',
    height: 14,
    width: 14,
    left: 7,
    top: 7,
  }
});

const mapStateToProps = state => (
  {
    logged: state.auth.loggedIn,
    user: state.auth.user,
    badges: state.badge
  }
);

export default connect(mapStateToProps, { loginSuccess, updateAvailableBadges, updateProfileBadges })(Login);
