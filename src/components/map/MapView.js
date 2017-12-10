import React, { Component } from 'react';
import { 
  View, 
  Dimensions, 
  Alert,
  Animated 
} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';
import firebase from 'firebase';
import MarkerDetails from './MarkerDetails';
import {
  updateUserPosition,
  updateMapRegion,
  updateMarkers,
  updateMarkerIndex
} from '../../actions';

// Grab screen dimensions
const screen = Dimensions.get('window');
// Set zoom
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const markerImg = require('../../assets/icons/flag2.png');

class MapViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enablePolyline: false
    };
    this.animation = new Animated.Value(-1);
    this.interpolations = null;
    this.animate.bind(this);
    this.watchId = null;
    this.isAnimating = false;
    this.geolocationOptions = { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000, maximumAge: 1000 };
    // this.polyLineCoords = [{ latitude: 34.06365072138657, longitude: -118.448552464198 }, { latitude: 34.061292, longitude: -118.447139 }];
  }

  // Best place to fetch data, will fetch after initial render
  componentDidMount() {
    // Begin tracking location
    this.watchLocation();
    const queryPath = `location_config/${this.props.uid}/nearby_portal`;

    firebase.database().ref(queryPath).once('value')
    .then( 
      snapshot => {
        const markers = snapshot.val().reduce((acc, curr, index) => {
          // Need to set up check to see which badges user has collected
          // Need to set up removal of collected badges.
          acc[index] = 
            { id: index,
              coordinates:
                { 
                  latitude: curr[0], 
                  longitude: curr[1] 
                },
              badge: this.props.availableBadges[index] 
            }; 
          return acc;
        }, []);
        
        this.props.updateMarkers({ markers });
      }
    )
    .catch(error => this.alertError(error.message));
  }

  componentWillUpdate(nextProps) {
    if (this.props.markerIndex !== nextProps.markerIndex && !nextProps.scroll) {
      this.animate(nextProps.markerIndex);
    }
    // Might need to do this.props.isANimating
    if (nextProps.isHunting && !this.isAnimating) {
      const midpoint = this.calcMidPoint(nextProps.userPosition, nextProps.selectedMarker);
      let latitudeDelta = Math.abs(nextProps.userPosition.latitude - nextProps.selectedMarker.coordinates.latitude);
      let longitudeDelta = Math.abs(nextProps.userPosition.longitude - nextProps.selectedMarker.coordinates.longitude);
      latitudeDelta += (latitudeDelta / 3);
      longitudeDelta += (longitudeDelta / 3);
      
      this.animateToRegion(midpoint, latitudeDelta, longitudeDelta);
      this.setState({ enablePolyline: true });
    }
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

  setInterpolation() {
    this.interpolations = this.props.markers.map((marker, index) => {
      const inputRange = [
        (index - 0.7),
        (index - 0.2),
        (index),
        (index + 0.3)
      ];

      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 1.75, 2.5, 1],
        extrapolate: 'clamp'
      });

      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0, 1, 0, 0],
        extrapolate: 'clamp'
      });

      return { scale, opacity };
    });
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
        console.log('my position is here')
        console.log(myPosition);
      if (!isEqual(myPosition, myLastPosition)) {
        this.props.updateUserPosition({ userPosition: myPosition });

        firebase.database().ref('current_location').child(this.props.uid)
          .set({ currentLocation: [myPosition.latitude, myPosition.longitude] })
          .catch(err => this.alertError(err.message));
      }
    },
    err => this.alertError(err.message),
    this.geolocationOptions);
  }

  alertError(err) {
    Alert.alert(
      'Error Occurred',
      err,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  }

  handleOnPress(index) {
    this.animate(index);
    this.props.updateMarkerIndex({ markerIndex: index, scroll: true });
  }

  calcMidPoint(current, marker) {
    this.isAnimating = true;
    const lat1 = current.latitude;
    const lat2 = marker.coordinates.latitude;
    const long1 = current.longitude;
    const long2 = marker.coordinates.longitude;

    return { latitude: (lat2 + lat1) / 2, longitude: (long2 + long1) / 2 };
  }

  animate(index) {
    const { coordinates } = this.props.markers[index];
    const singleMarkerLatDelta = LATITUDE_DELTA / 8;
    const singleMarkerLongDelta = LONGITUDE_DELTA / 8;

    this.animateToRegion(coordinates, singleMarkerLatDelta, singleMarkerLongDelta);

    const initialValue = (index - 0.7);

    this.animation.setValue(initialValue);
    Animated.timing(
      this.animation,
      {
        toValue: index,
        friction: 1,
        useNativeDriver: true
      }
    ).start();
  }

  animateToRegion(coordinates, latitudeDelta, longitudeDelta) {
    // Begin animation to region based on selected marker
    this.refs.map.animateToRegion(
      {
        ...coordinates,
        latitudeDelta,
        longitudeDelta
      }
    );
  }

  initializeMarkers() {
    this.setInterpolation();
    
    return this.props.markers.map((location, index) => {
      if (!this.props.isHunting) {
        return this.renderMarkers(location, index);
      } else if (this.props.isHunting && this.props.selectedMarker.id === index) {
        return this.renderMarkers(location, index);
      }
    });
  }

  renderMarkers(location, index) {
    const scaleStyle = {
      transform: [
        {
          scale: this.interpolations[index].scale,
        },
      ],
    };

    const opacityStyle = {
      opacity: this.interpolations[index].opacity,
    };

    return (
      <MapView.Marker 
        key={index} 
        coordinate={location.coordinates}
        style={styles.markerWrap}
        onPress={() => this.handleOnPress(index)}
      >
        <Animated.View style={[styles.ring, opacityStyle, scaleStyle]} />
        <Animated.Image 
            style={[styles.markerImage, scaleStyle]}
            source={markerImg} 
            resizeMode='contain'
        />
      </MapView.Marker>
    );
  }

  renderPolyline() {
    const startingCoordinates = { latitude: this.props.userPosition.latitude, longitude: this.props.userPosition.longitude };
    const endingCoordinates = { latitude: this.props.selectedMarker.coordinates.latitude, longitude: this.props.selectedMarker.coordinates.longitude }
    const polyLineCoords = [startingCoordinates, endingCoordinates];
    
    console.log('polyline');
    // console.log(polyLineCoords);
    return (
      <MapView.Polyline 
        coordinates={polyLineCoords} 
        strokeColor='#FEA2A4'
        strokeWidth={3}
        lineDashPattern={[5]} 
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
      {/* Alert the user if there was an issue */}
        <MapView
          showsUserLocation
          style={styles.map}
          ref='map'
          initialRegion={this.props.userPosition}
          onRegionChange={this.onRegionChange.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.props.markers && this.initializeMarkers()}
          {this.state.enablePolyline && this.renderPolyline()}
        </MapView>
        {this.props.markers && <MarkerDetails />}
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
  },
  ring: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(127, 205, 205, 0.5)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(127, 205, 205, 0.9)',
    opacity: 0
  },
  marker: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  markerImage: {
    width: 20,
    height: 20
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  }
};

const mapStateToProps = state => ({ ...state.map, ...state.auth.user, ...state.badge });

export default connect(mapStateToProps,
  {
    updateUserPosition,
    updateMapRegion,
    updateMarkers,
    updateMarkerIndex
  })(MapViews);
