import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { updateDisplayBadge, initializeHunt } from '../../actions';
import { Card, CardSection, Header, Button } from '../common';

class MarkerDetailItem extends Component {
  handleOnPress() {
    this.props.updateDisplayBadge({ displayBadge: this.props.marker.badge });
    // Need to disable ishunting when hunt is complete
    this.props.initializeHunt({ isHunting: true, selectedMarker: this.props.marker });
    // Add firebase command to tell which badge the user is currently looking for
  }

  render() {
    const { header, marker } = this.props;

    return (
      <Card>
        <CardSection>
          <View style={styles.container}>
            <Text style={styles.header}>{`${header}`}</Text>
          </View>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
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
  header: {
    fontFamily: 'IM Fell English',
    fontSize: 24,
    color: '#FEA2A4',
    backgroundColor: 'transparent',
  },
  image: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hunt: {
    color: '#ffffff',
    backgroundColor: '#FEA2A4',
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  }
});


const mapStateToProps = state => ({ ...state.map, ...state.badge });

export default connect(mapStateToProps, { updateDisplayBadge, initializeHunt })(MarkerDetailItem);
