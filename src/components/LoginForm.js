import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Button, 
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { loginSuccess } from '../actions/AuthActions';

const FBSDK = require('react-native-fbsdk');

const { LoginManager, AccessToken } = FBSDK;

class Login extends Component {
  constructor(props) {
   super(props);
   this.state = {
     showSpinner: true,
    };
  }

  componentDidMount() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val();
          if (user != null) {
            this.firebaseRef.child(auth.uid).off('value');
            this.props.loginSuccess(user);
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
                that.createUser(uid, json, token, fbImage)
              });
            })
            .catch(function(err) {
              console.log(err);
            });
          }
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
    firebase.database().ref('users').child(uid).update({ ...userData, ...defaults });
  }
  render() {
    return (
      this.state.showSpinner ? <View style={styles.container}><ActivityIndicator animating={this.state.showSpinner} /></View> :
      <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image 
              style={{ width: 140, height: 140 }}
              source={require('../img/pirate.png')} alt='pirate ship'
            />
            <Text style={styles.appTitleFont}>
              ARgo
            </Text>
            <TouchableOpacity onPress={this.onPressLogin.bind(this)} style={styles.buttonStyle}>
              <Text style={styles.titleFont}>
                Login with Facebook
              </Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#00aced",
    justifyContent: "center",
    alignItems: "center"
  },
  appTitleFont: {
    fontSize: 54,
    color: "#0084b4"
  },
  imageContainer: {
    height: 370,
    width: 280,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1
  },
  buttonStyle: {
    backgroundColor: "#68a0cf",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1
  },
  titleFont: {
    fontSize: 22
  }
});

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state);
  return {
    logged: state.auth.loggedIn,
    user: state.auth.user
  };
};

export default connect(mapStateToProps, { loginSuccess })(Login);
