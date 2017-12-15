import React, { Component } from 'react';
import { Animated, View, Image } from 'react-native';

const swipeUpImg = require('../../assets/gestures/swipe-up.png');
const swipeDownImg = require('../../assets/gestures/swipe-down.png');

class Gesture extends Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
    this.opacity = null;
    this.swipeUp = null;
    this.swipeDown = null;
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    this.animation.setValue(0);
    Animated.timing(
      this.animation,
      {
        toValue: 1,
        friction: 1,
        duration: 2500,
      }
    ).start(() => this.animate());
  }

  render() {
    this.opacity = this.animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [1, 0.75, 0.5, 0.25, 0],
      extrapolate: 'clamp'
    });

    this.swipeUp = this.animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, 15, 30, 45, 60],
      extrapolate: 'clamp'
    });

    this.swipeDown = this.animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [40, 30, 20, 10, 0],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.gesture, { marginBottom: this.swipeUp }]}>
        <Animated.Image source={swipeUpImg} style={[styles.image, { opacity: this.opacity }]} />
      </Animated.View>
    );
  }  
}

const styles = {
  gesture: {
    position: 'absolute',
    zIndex: 1,
    bottom: 80
  },
  image: {
    height: 50,
    width: 50,
  }
};

export default Gesture;
