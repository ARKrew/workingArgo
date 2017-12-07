import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator,
  Button, 
  Text,
  Image
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { loginSuccess } from '../actions/AuthActions';

const FBSDK = require('react-native-fbsdk');
const pirateImg = require('../assets/images/pirate.png');

const { LoginManager, AccessToken } = FBSDK;

class Login extends Component {
  constructor(props) {
   super(props);
   this.state = {
     showSpinner: true,
    };
    this.authenticatedUser = false;
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
            .catch(err => this.alertError(err)
            );
          }
        );
      } 
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
      this.state.showSpinner ? 
      <View style={styles.container}>
        <ActivityIndicator animating={this.state.showSpinner} />
      </View> :
      <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#1E5AFF' }} />
          <View style={styles.container}>
            <Image 
              style={{ width: 110, height: 110 }}
              source={pirateImg} alt='pirate ship'
            />
            <Text style={styles.titleFont}>
              ARgo
            </Text>
            <Button
              style={styles.buttonStyle}
              onPress={this.onPressLogin.bind(this)}
              title="Login with Facebook"
            />
          </View>
          <View style={{ flex: 1, backgroundColor: '#1E5AFF' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleFont: {
    fontSize: 36,
    color: '#1E5AFF'
  },
  buttonStyle: {
    backgroundColor: '#841584',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
  }
});

const mapStateToProps = state => (
  {
    logged: state.auth.loggedIn,
    user: state.auth.user
  }
);

export default connect(mapStateToProps, { loginSuccess })(Login);
