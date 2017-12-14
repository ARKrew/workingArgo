import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

const buttonImg = require('../../assets/models/button/icon_arrow.png');

const BackButton = (props) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.to} onPress={props.onPress}>
      <Image 
        source={buttonImg} 
        style={styles.image}
      />
    </TouchableOpacity>
  </View>
);

const styles = {
  container: {
    position: 'absolute',
    left: '1.5%',
    top: '1.5%',
    zIndex: 1
  },
  image: {
    height: 50,
    width: 50,
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center'
  }
};

export default BackButton;
