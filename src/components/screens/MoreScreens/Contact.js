import React from 'react';
import { View, Text } from 'react-native';
import Communications from 'react-native-communications';
import { Header, Button, CardSection } from '../../common';

const Contact = () => {
  return <View>
      <Header headerText="Contact" />
      <Text>Please send us any questions, comments, or concerns</Text>
      <CardSection>
        <Button
          onPress={() =>
            Communications.email(
              ["arkrewucla@gmail.com"],
              ["lowkeendonovan@gmail.com", "lugraciecy@gmail.com"],
              null,
              "ARgo User",
              "Talk to us!"
            )
          }
        >
          Email Us!
        </Button>
      </CardSection>
      <CardSection>
        <Button
          onPress={() =>
            Communications.web("https://github.com/ARKrew/workingArgo")
          }
        >
          View GitHub Repo
        </Button>
      </CardSection>
    </View>;
};

export default Contact;
