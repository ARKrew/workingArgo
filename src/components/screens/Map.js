import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import MapViews from '../map/MapView';

class Map extends Component {
  renderMap() {
    return <MapViews navigation={this.props.dispatch} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header headerText={'Map'} />
        {this.props.loggedIn && !this.props.enterAR && this.renderMap()}
      </View>
    );
  }
}

const mapStateToProps = state => ({ ...state.auth, ...state.demoAR, currentRoute: state.nav.routes[1].index });

export default connect(mapStateToProps)(Map);
