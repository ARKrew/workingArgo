import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import MapViews from '../map/MapView';

class Map extends Component {
  shouldComponentUpdate() {
    if (this.props.currentRoute === 1) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    console.log('map')
    return (
      <View style={{ flex: 1 }}>
        <Header headerText={'Map'} />
        <MapViews />
      </View>
    );
  }
}

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(Map);
