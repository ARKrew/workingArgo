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
    
    this.animation = new Animated.Value(-1);
    this.interpolations = null;
    this.animate.bind(this);
    this.watchId = null;
    this.geolocationOptions = { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000, maximumAge: 1000 };
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
            { 
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

  animate(index) {
    this.animateToRegion(index);

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

  animateToRegion(index) {
    const { coordinates } = this.props.markers[index];
    // Begin animation to region based on selected marker
    this.refs.map.animateToRegion(
      {
        ...coordinates,
        latitudeDelta: LATITUDE_DELTA / 8, 
        longitudeDelta: LONGITUDE_DELTA / 8
      }
    );
  }

  renderMarkers() {
    this.setInterpolation();
    
    return this.props.markers.map((location, index) => {
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
    });
  }

  render() {
    console.log(this.props)
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
          {this.props.markers && this.renderMarkers()}
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
