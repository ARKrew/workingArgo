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
    console.log('this is the profile')
    console.log(this.props);
    this.setState({ uri: this.props.dp });
}

// shouldComponentUpdate(nextProps) {
//   console.log('this is the current route');
//   console.log(nextProps.currentRoute);
//   return nextProps.currentRoute === 0 ? true : false;
// }

  render() {
    const headerName = this.props.displayName;
    const joinDate = this.props.joinDate;

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

const mapStateToProps = state => ({ ...state.auth.user, currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(Profile);
