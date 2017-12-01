import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, CardSection, Header } from '../common';
import firebase from 'firebase';

// const { width, height } = Dimensions.get("window");
// const auth = firebaseApp.auth();

class Profile extends Component {

constructor(props) {
    super(props);
    this.state = {
      uri: ''
    };
}

componentDidMount() {
    console.log(firebase.auth().currentUser);
    this.fireBaseListener = firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val();
          this.setState({ uri: user.dp });
        });
      }
    });
}

shouldComponentUpdate() {
  if (this.props.currentRoute === 0) {
    return true;
  }
  else {
    return false;
  }
}

  render() {
    console.log('profile')
    const headerName = firebase.auth().currentUser.displayName;
    const joinDate = firebase.auth().currentUser.metadata.creationTime.split(' ').slice(1, -2).join(' ');
      return (
        <View>
            <Header headerText={headerName} />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={styles.image}
                source={{ uri: this.state.uri }}
              />
            <Text style={styles.text}>Member since: {joinDate}</Text>
            </View>
            <View>
            <Card>
              <CardSection>
                <Text style={styles.badgesText}>Badges</Text>
              </CardSection>
            </Card>
            </View>

          </View>
      );
  }
}

const styles = StyleSheet.create({
  text: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    marginTop: 20,
    width: 120,
    height: 120,
  },
  badgesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowRadius: 2
  }
});

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(Profile);
