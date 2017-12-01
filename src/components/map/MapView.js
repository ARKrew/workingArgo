import React, { Component } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';
import { 
  updateUserPosition, 
  updateMapRegion, 
  errorMessage 
} from '../../actions';

// Grab screen dimensions
const screen = Dimensions.get('window');
// Set zoom 
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MapViews extends Component {
  constructor(props) {
    super(props);
    this.watchId = null;
    this.geolocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
  }

  // Best place to fetch data, will fetch after initial render
  componentDidMount() {
    // Begin tracking location
    this.watchLocation();
  }

  // Clear watch when component unmounts
  componentWillUnmount() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  // If user moves map around track where they're looking
  onRegionChange(mapRegion) {
    this.props.updateMapRegion({ mapRegion });
  }

  alertError() {
    Alert.alert(
      'Error Occurred',
      this.props.error,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  }

  // Watch user's location
  watchLocation() {
    this.watchID = navigator.geolocation.watchPosition(position => {
      const myLastPosition = this.props.userPosition;
      const myPosition = 
      { 
        latitude: position.coords.latitude,
        longitude: position.coords.longitude, 
        latitudeDelta: LATITUDE_DELTA, 
        longitudeDelta: LONGITUDE_DELTA 
      };
      if (!isEqual(myPosition, myLastPosition)) {
        this.props.updateUserPosition({ userPosition: myPosition });
      }
    }, 
    err => this.errorMessage({ error: err }), 
    this.geolocationOptions);
  }

  render() {
    return (
      <View style={styles.container}>
      {/* Alert the user if there was an issue */}
        {this.props.error && this.alertError()}
        <MapView
          showsUserLocation
          style={styles.map}
          initialRegion={this.props.userPosition}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsIndoor={false}
          onRegionChange={this.onRegionChange.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
};

const mapStateToProps = state => {
  return state.map;
};

export default connect(mapStateToProps, 
  { 
    updateUserPosition, 
    updateMapRegion, 
    errorMessage 
  })(MapViews);
