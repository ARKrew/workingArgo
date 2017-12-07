import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    padding: 10,
    borderWidth: 0,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    // marginRight: 10,
    // marginLeft: 10,
    position: 'relative'
  }
};

export { CardSection };
