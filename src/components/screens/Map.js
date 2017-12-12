import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import MapViews from '../map/MapView';
import { NavigationActions } from 'react-navigation';

class Map extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.currentRoute === 1;
  }

  render() {
    console.log('map screen rendered');
    console.log(this.props);
    return (
      <View style={{ flex: 1 }}>
        <Header headerText={'Map'} />
        <MapViews navigation={this.props.dispatch} />
      </View>
    );
  }
}

const mapStateToProps = state => ({ currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(Map);
