import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Header } from '../../common';
import ViroMedia from '../../../assets/images/viro.png';
import FireBase from '../../../assets/images/firebase.png';
import RN from '../../../assets/images/react-logo.png';

const About = () => {
  return (
    <View>
      <Header headerText="About" />
      <ScrollView style={styles.containerView}>
        <Text style={styles.textFont}>
          ARgo is a technology company that uses location intelligence and
          augmented reality to immerse users in a new experience. Users have
          the ability to enter into new worlds through AR portals and collect
          badges with their friends. ARgo believes that life is about
          acquiring new experiences and we want to help.
        </Text>
        <View style={styles.imageContainer}>
          <Image style={styles.imageStyle} source={FireBase} />
          <Image style={styles.imageStyle} source={ViroMedia} />
          <Image style={styles.imageStyle} source={RN} />
        </View>
        <Text style={styles.imageFooter}>
          Powered by:
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    paddingBottom: 165,
  },
  titleFont: {
    backgroundColor: 'transparent',
    fontFamily: 'IM Fell English',
    fontStyle: 'italic',
    fontSize: 45,
    textAlign: 'center',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f37a81'
  },
  textFont: {
    fontSize: 18,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 25,
    textAlign: 'center',
    fontFamily: 'Lato-Regular'
  },
  imageStyle: {
    height: 70,
    width: 70,
    marginRight: 15,
    marginLeft: 15
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageFooter: {
    fontSize: 6,
    color: 'grey',
    textAlign: 'center'
  }
});

export default About;
