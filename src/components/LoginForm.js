import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Button
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
          <Button
            onPress={this.onPressLogin.bind(this)}
            title="Login with Facebook"
            color="#841584"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
