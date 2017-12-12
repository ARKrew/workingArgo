import React, { Component } from 'react';
import { Animated, Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { enterAR } from '../../actions';

const navigateAction = NavigationActions.navigate({
  routeName: 'MainSceneAR',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'MainSceneAR' })
});

class MapARNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: true,
    };
  }

  _renderButton = (text, onPress) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
          <Text>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Portal is Ready!</Text>
      {this._renderButton('Open Portal', () => {
        const { navigation } = this.props;
        
        this.setState({ visibleModal: false });

        this.props.enterAR({
          enterAR: true,
        });

        navigation(navigateAction);
        })}
    </View>
  );

  render() {
    return (
      <Modal
        isVisible={this.state.visibleModal}
        backdropOpacity={0.3}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}
        useNativeDriver
      >
        {this._renderModalContent()}
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, { enterAR })(MapARNav);
