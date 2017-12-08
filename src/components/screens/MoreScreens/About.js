import React from 'react';
import { View, Text } from 'react-native';
import { Header } from '../../common';

const About = () => {
  return (
    <View>
      <Header headerText='About' />
      <Text>Here is some text for this page.</Text>
    </View>
  );
};

export default About;
