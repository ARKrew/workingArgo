import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header, Button, CardSection } from '../common';

// Actions
import { enterAR, enterARTutorial } from '../../actions';

class List extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.currentRoute === 2;
  }

  // pressedDemo = () => {
  //   this.props.enterAR({
  //     enterAR: true,
  //   });
  //   this.props.navigation.navigate('MainSceneAR');
  // };

  pressedTutorial = () => {
    this.props.enterARTutorial({
      enterARTutorial: true,
    });
    this.props.navigation.navigate('TutorialAR');
  }

  render() {
    console.log('this is for list')
    console.log(this.props);
    return (
      <View>
        <Header headerText={'Tutorial'} />
        <CardSection>
          <Button onPress={this.pressedDemo}>Demo AR Portal</Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.pressedTutorial}>Tutorial AR</Button>
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
  enterAR,
  enterARTutorial
})(List);
