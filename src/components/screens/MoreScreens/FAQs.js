import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header } from "../../common";

const FAQs = () => {
  return <View>
      <Header headerText="FAQs" />
      <ScrollView style={styles.containerView}>
        <Text style={styles.titleStyle}>What is AR?</Text>
        <Text style={styles.textFont}>
          AR stands for augmented reality. Augmented reality (AR) is a live
          direct or indirect view of a physical, real-world environment whose
          elements are "augmented" by computer-generated or extracted
          real-world sensory input such as sound, video, graphics, haptics or
          GPS data.
        </Text>
        <Text style={styles.titleStyle}>How do I open a portal?</Text>
        <Text style={styles.textFont}>
          On the map page, click on a flag marker and pull the modal box
          upwards to begin a "hunt". Once you get close enough to the marker,
          a button will display to open a portal. Click the button and enter
          the portal!
        </Text>
        <Text style={styles.titleStyle}>
          How do I contact the creators of the app?
        </Text>
        <Text style={styles.textFont}>
          Please visit the "Contact" page to email the creators of the app.
        </Text>
        <Text style={styles.titleStyle}>What's with the pirate theme?</Text>
        <Text style={styles.textFont}>
          With all of the love for minions, animals, and aliens, we wanted to
          make sure pirates got some love. They're also extremely adorable
          when not ravaging a neighboring ship for booty.
        </Text>
        <Text style={styles.titleStyle}>Is this available for Android?</Text>
        <Text style={styles.textFont}>
          Currently the app is only compatible on iOS but we are hoping to
          release Android compatability soon.
        </Text>
      </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
  containerView: {
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 60
  },
  titleFont: {
    backgroundColor: "transparent",
    fontFamily: "IM Fell English",
    fontStyle: "italic",
    fontSize: 45,
    textAlign: "center",
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#f37a81"
  },
  textFont: {
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily: "Lato-Regular"
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 4
  }
});

export default FAQs;
