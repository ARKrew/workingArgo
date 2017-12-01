import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Header } from '../../common';

const TermsOfService = () => {
    return (
        <View>
          <Header headerText={'Terms of Service'} />
            <ScrollView style={styles.viewStyle}>
              <Text style={styles.titleStyle}>Last updated: 11/26/17</Text>
                <Text>
                  Please read these Terms of Service ("Terms", "Terms and Conditions") carefully before using the ARgo website and the ARgo mobile application (the "Service") operated by ARgo.
                  Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                  By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                </Text>
              <Text style={styles.titleStyle}>Content</Text>
                <Text>
                  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the …
                </Text>
              <Text style={styles.titleStyle}>Links To Other Web Sites</Text>
                <Text>
                  Our Service may contain links to third-party web sites or services that are not owned or controlled by ARgo.
                  ARgo has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that ARgo shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                </Text>
              <Text style={styles.titleStyle}>Changes</Text>
                <Text>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 15 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </Text>
              <Text style={styles.titleStyle}>Contact Us</Text>
                <Text>
                  If you have any questions about these Terms, please contact us.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = {
  viewStyle: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 65,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  }
};


export default TermsOfService; 
