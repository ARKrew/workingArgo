import React, { Component } from 'react';
import firebase from 'firebase';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Button, Header } from '../common';
import { logOut } from '../../actions/AuthActions';

class More extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.currentRoute === 3 ? true : false;
  }

  pressedTerms = () => {
    this.props.navigation.navigate('TermsOfService');
  };

  pressedHelp = () => {
    this.props.navigation.navigate('HelpAndAbout');
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
    console.log('more')
    return (
      <View>
        <Header headerText={'More'} />
        <CardSection>
          <Button onPress={this.pressedHelp}>
            Help And About
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedTerms}>
            Terms of Service
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
