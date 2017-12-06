
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
import {
  updateUserPosition,
  updateMapRegion,
  updateMarkers,
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
    this.animation = new Animated.Value(-1);
    this.interpolations = null;
    this.animate.bind(this);
    this.watchId = null;
    this.index = null;
    this.geolocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
  }

  // Best place to fetch data, will fetch after initial render
  componentDidMount() {
    // Begin tracking location
    this.watchLocation();
    const userId = firebase.auth().currentUser.uid;
    const queryPath = 'location_config/' + userId + '/nearby_portal';

    firebase.database().ref(queryPath).once('value')
    .then( 
      snapshot => {
        const markerPositions = snapshot.val().reduce((acc, curr, index) => {
          acc[index] = 
          { 
            coordinates:
              { 
                latitude: curr[0], 
                longitude: curr[1] 
              } 
          }; 
          return acc;
        }, []);
        
        this.props.updateMarkers({ markerPositions });
      }
    )
    .catch(error => console.log(error));
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
    this.interpolations = this.props.markerPositions.map((marker, index) => {
      const inputRange = [
        (index - 0.7),
        (index - 0.2),
        (index),
        (index + 0.3),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 1.75, 2.5, 1],
        extrapolate: 'clamp',
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0, 1, 0, 0],
        extrapolate: 'clamp',
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
      }
    },
    err => this.errorMessage({ error: err }),
    this.geolocationOptions);
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

  animate(index) {
    this.index = index;
    this.animateToRegion();
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

  animateToRegion() {
    const { coordinates } = this.props.markerPositions[this.index];
    // Begin animation to region based on selected marker
    this.refs.map.animateToRegion(
      {
        ...coordinates,
        latitudeDelta: LATITUDE_DELTA, 
        longitudeDelta: LONGITUDE_DELTA
      }
    );
  }

  renderMarkers() {
    const marker = require('../../assets/icons/flag2.png');

    this.setInterpolation();
    
    return this.props.markerPositions.map((location, index) => {
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
          onPress={() => this.animate(index)}
        >
          <Animated.View style={[styles.ring, opacityStyle, scaleStyle]} />
          <Animated.Image 
              style={[styles.markerImage, scaleStyle]}
              source={marker} 
              resizeMode='contain'
          />
        </MapView.Marker>
        );
    });
  }

  render() {
    return (
      <View style={styles.container}>
      {/* Alert the user if there was an issue */}
        {this.props.error && this.alertError()}
        <MapView
          showsUserLocation
          style={styles.map}
          ref='map'
          initialRegion={this.props.userPosition}
          onRegionChange={this.onRegionChange.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.props.markerPositions && this.renderMarkers()}
        </MapView>
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

const mapStateToProps = state => state.map;

export default connect(mapStateToProps,
  {
    updateUserPosition,
    updateMapRegion,
    updateMarkers,
    errorMessage
  })(MapViews);
