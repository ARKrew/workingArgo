import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header, Button, CardSection } from '../common';

class List extends Component {
  shouldComponentUpdate() {
    if (this.props.currentRoute === 2) {
      return true;
    }
    else {
      return false;
    }
  }

  pressedAR = () => {
    this.props.navigation.navigate('ARPortal');
  };

  pressedDemo = () => {
    this.props.navigation.navigate('DemoARPortal');
  };

  render() {
    console.log('list')
    return (
      <View>
        <Header headerText={'List'} />
        <CardSection>
          <Button onPress={this.pressedDemo}>Demo AR Portal</Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedAR}>AR Portal</Button>
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(List);
