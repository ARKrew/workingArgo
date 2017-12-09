import React, { Component } from 'react';
import firebase from 'firebase';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Button, Header } from '../common';
import { logOut } from '../../actions/AuthActions';

class More extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.currentRoute === 3;
  }

  pressedTerms = () => {
    this.props.navigation.navigate('TermsOfService');
  };

  pressedAbout = () => {
    this.props.navigation.navigate('About');
  }

  pressedContact = () => {
    this.props.navigation.navigate('Contact');
  }

  pressedLogOut = async () => {
      try {
          await firebase.auth().signOut();
          this.props.logOut();
      } catch (e) {
          console.log(e);
      }
  }

  render() {
    return (
      <View>
        <Header headerText={'More'} />
        <CardSection>
          <Button onPress={this.pressedAbout}>
            About
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedTerms}>
            Terms of Service
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedContact}>
            Contact
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedLogOut.bind(this)}>
            Log Out
          </Button>
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index, logged: state.auth.loggedIn });

export default connect(mapStateToProps, { logOut })(More);
