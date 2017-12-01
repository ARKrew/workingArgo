import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Button, Header } from '../common';

class More extends Component {
  shouldComponentUpdate() {
    if (this.props.currentRoute === 3) {
      return true;
    }
    else {
      return false;
    }
  }

  pressedTerms = () => {
    this.props.navigation.navigate('TermsOfService');
  };

  pressedHelp = () => {
    this.props.navigation.navigate('HelpAndAbout');
  }

  pressedLogOut = () => {
    this.props.navigation.navigate('LogOut');
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
          <Button onPress={this.pressedLogOut}>
            Log Out
          </Button>
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(More);
