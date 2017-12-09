import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, CardSection, Header } from '../common';
import { updateProfileBadges } from '../../actions';

class Profile extends Component {

constructor(props) {
    super(props);
}

// TODO: Pass in user info from firebase to update badges
// componentWillMount() {
//   const selectedBadge = '016-bomb.png';
//   this.props.updateProfileBadges({ displayBadge: selectedBadge });
// }

// shouldComponentUpdate(nextProps) {
//   console.log('this is the current route');
//   console.log(nextProps.currentRoute);
//   return nextProps.currentRoute === 0 ? true : false;
// }

// Displays badges collected by user
renderUserBadges() {
  return this.props.userBadges.collectedBadges.map((badge) => {
    console.log(badge.image);
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
    justifyContent: 'flex-start',
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
  updateProfileBadges
})(Profile);
