import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header, Button, CardSection } from '../common';

// Actions
import { enterAR } from '../../actions';

class List extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.currentRoute === 2 ? true : false;
  }

  pressedDemo = () => {
    this.props.enterAR({
      enterAR: true,
    });
    this.props.navigation.navigate('MainSceneAR');
  };

  render() {
    return (
      <View>
        <Header headerText={'List'} />
        <CardSection>
          <Button onPress={this.pressedDemo}>Demo AR Portal</Button>
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => ({ 
  currentRoute: state.nav.routes[1].index, 
  ARstate: state.demoAR 
});

export default connect(mapStateToProps, {
  enterAR
})(List);
