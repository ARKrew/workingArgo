import React, { Component } from 'react';
import firebase from 'firebase';
import { ScrollView, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Communications from "react-native-communications";
import { CardSection, Button, Header } from '../common';
import { logOut, resetMap } from '../../actions';

class More extends Component {
  pressedTerms = () => {
    this.props.navigation.navigate('TermsOfService');
  };

  pressedAbout = () => {
    this.props.navigation.navigate('About');
  }

  pressedContact = () => {
    Communications.email(
    ['arkrewucla@gmail.com'],
    null,
    null,
    'ARgo User',
    'Talk to us!'
    );
  }

  pressedDevelopment = () => {
    Communications.web('https://github.com/ARKrew/workingArgo');
  }

  pressedLogOut = async () => {
      try {
          await firebase.auth().signOut();
          this.props.logOut();
          this.props.resetMap();
      } catch (e) {
          console.log(e);
      }
  }

  render() {
    return (
      <View>
        <Header headerText={'More'} />
        <ScrollView style={styles.scrollStyle}>
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
            <Button onPress={this.pressedDevelopment}>
              Development
            </Button>
          </CardSection>
          <CardSection>
            <Button onPress={this.pressedLogOut.bind(this)}>
              Log Out
            </Button>
          </CardSection>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  scrollStyle: {
    paddingBottom: 250
  }
};

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index, logged: state.auth.loggedIn });

export default connect(mapStateToProps, { logOut, resetMap })(More);
