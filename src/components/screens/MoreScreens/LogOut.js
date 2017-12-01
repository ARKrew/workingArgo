import React from 'react';
import { View, Text } from 'react-native';
import { Button, CardSection, Header } from '../../common';

const LogOut = () => {
  return (
    <View>
      <Header headerText='Log Out' />
      <Text style={styles.textStyle}>Are You Sure You Want To Log Out?</Text>
      <CardSection>
        <Button>Yes</Button>
      </CardSection>
      <CardSection>
        <Button>No</Button>
      </CardSection>
    </View>
  );
};

const styles = {
  textStyle: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default LogOut;
