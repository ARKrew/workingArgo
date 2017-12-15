import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { updateDisplayBadge, initializeHunt } from '../../actions';
import { Card, CardSection } from '../common';

class MarkerDetailItem extends Component {
  handleOnPress() {
    this.props.updateDisplayBadge({ displayBadge: this.props.marker.badge });
    // Need to disable ishunting when hunt is complete
    this.props.initializeHunt({ isHunting: true, selectedMarker: this.props.marker });
    // Add firebase command to tell which badge the user is currently looking for
  }

  render() {
    const { marker } = this.props;

    return (
      <Card>
        <CardSection>
          <View style={styles.container}>
            <Text style={styles.header}>{marker.badge.title}</Text>
            <Text style={styles.description}>{marker.badge.description}</Text>
          </View>
        </CardSection>
        <CardSection>
          <View style={styles.badgeContainer}>
            <Image style={styles.image} source={marker.badge.image} />
          </View>
        </CardSection>
          <View>
            <TouchableOpacity
              onPress={this.handleOnPress.bind(this)}
            >
              <Text style={styles.hunt}>Begin this hunt!</Text>
            </TouchableOpacity>
          </View>
        <CardSection />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeContainer: {
    flex: 1,
    paddingBottom: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontFamily: 'IM Fell English',
    fontSize: 30,
    paddingTop: 15,
    paddingBottom: 30,
    color: '#FEA2A4',
  },
  description: {
    fontFamily: 'Lato-Regular',
    fontSize: 20,
    paddingBottom: 10,
    color: '#000000',
  },
  image: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hunt: {
    color: '#ffffff',
    backgroundColor: '#FEA2A4',
    fontFamily: 'Lato-Regular',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 15
  }
});


const mapStateToProps = state => ({ ...state.map, ...state.badge });

export default connect(mapStateToProps, { updateDisplayBadge, initializeHunt })(MarkerDetailItem);
