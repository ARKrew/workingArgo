import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import firebase from 'firebase';
import { 
  Card, 
  CardSection, 
  Header 
} from '../common';
import { 
  updateProfileBadges, 
  updateAvailableBadges 
} from '../../actions';
import {
  profileBadges as colorBadges,
  profileBadgesGreyScale as greyBadges
 } from '../../constants';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileBadges: []
    };
  }

  componentDidMount() {
    this.initFirebaseListener();
  }

  componentWillUnmount() {
    // Clear firebase listener on unmount
    firebase.database().ref(`collected_badges/${this.props.uid}`).off();
  }

  initFirebaseListener() {
    firebase.database().ref(`collected_badges/${this.props.uid}`).on('value', snapshot => {
      const collectedBadges = snapshot.val() || [];

      const availableBadges = this.props.userBadges.availableBadges.filter(
        badge => collectedBadges.indexOf(badge.fileName) === -1
      );
      
      this.props.updateAvailableBadges({ availableBadges });

      this.props.updateProfileBadges({ collectedBadges });

      this.calcDisplaybadges(collectedBadges);
    });
  }

  calcDisplaybadges(collectedBadges) {
    const profileBadges = greyBadges.reduce((acc, curr, index) => {
      acc[index] = collectedBadges.indexOf(curr.fileName) === -1 ? curr : colorBadges[index];
      return acc;
    }, []);

    this.setState({ profileBadges });
  }

// Displays badges collected by user
  renderUserBadges() {
    return this.state.profileBadges.map((badge) => {
      return (
        <Image
          style={styles.badge}
          key={badge.fileName}
          source={badge.image}
        />
      );
    });
  }

  render() {
    const headerName = this.props.displayName;
    const joinDate = this.props.joinDate;
    const uri = this.props.dp;

    return (
      <View>
        <Header headerText={headerName} />
        <View style={styles.userContainer}>
          <Image
            style={styles.userImage}
            source={{ uri }}
          />
          <Text style={styles.userText}>Member since: {joinDate}</Text>
        </View>
        <View>
          <Card>
            <CardSection>
              <Text style={styles.badgesHeader}>Badges</Text>
            </CardSection>
          </Card>
        </View>
        <ScrollView>
          <View style={styles.badgeContainer}>
            {this.renderUserBadges()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  userImage: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 60
  },
  userText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
  badgesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowRadius: 2,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'stretch'
  },
  badge: {
    width: 70,
    height: 70,
    margin: 5
  }
});

const mapStateToProps = state => ({
  ...state.auth.user,
  currentRoute: state.nav.routes[1].index,
  userBadges: state.badge
});

export default connect(mapStateToProps, {
  updateProfileBadges,
  updateAvailableBadges
})(Profile);
