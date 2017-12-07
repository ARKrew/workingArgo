import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableHighlight,
  Text,
  Image
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { loginSuccess } from '../actions/AuthActions';

const FBSDK = require('react-native-fbsdk');

const { LoginButton, LoginManager, AccessToken } = FBSDK;

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
    this.setState({ showSpinner: true })
        LoginManager.logInWithReadPermissions([
          'public_profile',
          'user_birthday',
          'email',
          'user_photos'
        ])
        .then((result) => this.handleCallBack(result),
          function(error) {
            alert('Login fail with error: ' + error);
          }
        );
  }

  handleCallBack(result) {
    let that = this;
    if (result.isCancelled) {
      alert('Login canceled');
    } else {
          AccessToken.getCurrentAccessToken().then(
          (data) => {
            const token = data.accessToken
            fetch('https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
              const imageSize = 120
              const facebookID = json.id
              const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
             this.authenticate(data.accessToken)
              .then(function(result) {
                const { uid } = result;
                that.createUser(uid, json, token, fbImage);
              });
            })
            .catch(function(err) {
              console.log(err);
            });
          }
        );
    }
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
          firebase.database().ref('location_config').child(uid)
            .update({ currentLocation });
        },
        error => console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }
  }

  authenticate = (token) => {
    const provider = firebase.auth.FacebookAuthProvider;
    const credential = provider.credential(token);
    return firebase.auth().signInWithCredential(credential);
  }

  createUser = (uid, userData, token, dp) => {
    const defaults = {
      uid,
      token,
      dp
    };
    firebase.database().ref('users').child(uid)
      .update({ ...userData, ...defaults })
      .then(() => this.getCurrentLocation(defaults));
  }
  render() {
    return (
      this.state.showSpinner ? <View style={styles.container}><ActivityIndicator animating={this.state.showSpinner} /></View> :
      <View style={{ flex: 1, backgroundColor: '#72CDCE' }}>
          <View style={styles.container}>
            <Image
              style={{ width: 110, height: 110 }}
              source={require('../assets/images/pirate.png')} alt='pirate ship'
            />
            <Text style={styles.titleFont}>
              ARgo
            </Text>
              <TouchableHighlight
                style={styles.container2}
                onPress={this.onPressLogin.bind(this)}
              >
                <View style={styles.FBLoginButton}>
                  <Image style={styles.FBLogo} source={require('../assets/images/FB-f-Logo__white_144.png')} />
                  <Text style={styles.FBLoginButtonText}
                    numberOfLines={1}>Continue with Facebook</Text>
                </View>
              </TouchableHighlight>
          </View>
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
    fontFamily: 'IM Fell English',
    fontStyle: 'italic',
    fontSize: 45,
    color: '#FCFCFA'
  },
  container2: {
    marginTop: 350,
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

const mapStateToProps = (state) => {
  return {
    logged: state.auth.loggedIn,
    user: state.auth.user
  };
};

export default connect(mapStateToProps, { loginSuccess })(Login);
