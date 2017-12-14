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
import MapARNav from './MapARNav';
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
const geolocationOptions = { enableHighAccuracy: true, distanceFilter: 1, timeout: 20000, maximumAge: 1000 };
const markerImg = require('../../assets/icons/flag2.png');

class MapViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enablePolyline: false,
      enablePortal: false,
      portalKey: null
    };
    this.animation = new Animated.Value(-1);
    this.interpolations = null;
    this.animate.bind(this);
    this.watchId = null;
  }

  // Best place to fetch data, will fetch after initial render
  componentDidMount() {
    // Begin tracking location
    this.watchLocation();
    // Set up firebase listeners
    this.initFirebaseListeners();
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHunting) {
      this.animateToPolyline(nextProps);
    }
    if (!nextProps.isHunting && this.state.enablePortal && this.state.enablePolyline && this.state.portalKey) {
      this.setState(
        { 
          enablePolyline: false, 
          enablePortal: false,
          portalKey: null 
        }
      );
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.markerIndex !== nextProps.markerIndex && !nextProps.scroll) {
      this.animate(nextProps.markerIndex);
    }
  }

  componentWillUnmount() {
    // Clear watch when component unmounts
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
    // Clear firebase listeners when component unmounts
    // firebase.database().ref('james_test').child('open').off();
    firebase.database().ref('portal_open').child(this.props.uid).off();
    firebase.database().ref('location_config').child(this.props.uid).child('nearby_portal').off();
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
    geolocationOptions);
  }

  initFirebaseListeners() {
    const uid = this.props.uid;
    const firebaseConfig = 
      {
        marker: `location_config/${uid}/nearby_portal`,
        portal: `portal_open/${uid}`
      };
    const error = 'error setting up firebase listeners';

    Object.entries(firebaseConfig).forEach(([key, val]) => {
      switch (key) {
        case 'marker':
          this.generateMarkerListeners(val);
          break;
        case 'portal':
          this.enablePortalListener(val);
          break;
        default:
          this.alertError(error);
          break;
      }
    });
  }

  enablePortalListener(node) {
    // Database.on does not retrun a promise, must use try catch block
    try {
      firebase.database().ref(node).on('value', snapshot => {
      // firebase.database().ref('james_test/open').on('value', snapshot => {
        // Check that selected marker key matches
        const portal = snapshot.val();

        if (portal.open_portal === true && portal.portal_key) {
          this.setState({ enablePortal: true, portalKey: portal.portal_key });
        }
      });
    } catch (error) {
      this.alertError(error.message);
    }
  }

  generateMarkerListeners(node) {
    // Database.on does not retrun a promise, must use try catch block
    try {
      firebase.database().ref(node).on('value', snapshot => {
        // In case there are no markers from firebase, display empty array
        const dbMarkers = snapshot.val() || [];
        const markers = dbMarkers.reduce((acc, curr, index) => {
          acc[index] = 
            { 
              id: index,
              firebaseKey: curr.key,
              coordinates:
                { 
                  latitude: curr.location[0], 
                  longitude: curr.location[1] 
                },
              badge: this.props.availableBadges[index] 
            }; 
          return acc;
        }, []);
        
        this.props.updateMarkers({ markers });
        });
    } catch (error) {
      this.alertError(error.message);
    }
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

  animateToPolyline(nextProps) {
    const midpoint = this.calcMidPoint(nextProps.userPosition, nextProps.selectedMarker);
    let latitudeDelta = Math.abs(nextProps.userPosition.latitude - nextProps.selectedMarker.coordinates.latitude);
    let longitudeDelta = Math.abs(nextProps.userPosition.longitude - nextProps.selectedMarker.coordinates.longitude);
    latitudeDelta += (latitudeDelta / 3);
    longitudeDelta += (longitudeDelta / 3);
    
    this.animateToRegion(midpoint, latitudeDelta, longitudeDelta);
    this.setState({ enablePolyline: true });
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

  renderModal() {
    return <MapARNav navigation={this.props.navigation} />;
  }

  renderPolyline() {
    const startingCoordinates = { latitude: this.props.userPosition.latitude, longitude: this.props.userPosition.longitude };
    const endingCoordinates = { latitude: this.props.selectedMarker.coordinates.latitude, longitude: this.props.selectedMarker.coordinates.longitude };
    const polyLineCoords = [startingCoordinates, endingCoordinates];
    
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
        <MapView
          showsUserLocation
          style={styles.map}
          ref='map'
          initialRegion={this.props.userPosition}
          // onRegionChange={this.onRegionChange.bind(this)}
          // onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.props.markers && this.initializeMarkers()}
          {this.state.enablePolyline && this.renderPolyline()}
        </MapView>
        {
          !this.props.inPortal &&
          this.props.isHunting && 
          this.state.enablePortal && 
          this.state.portalKey === this.props.selectedMarker.firebaseKey &&  
          this.renderModal()
        }
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

const mapStateToProps = state => (
  { 
    ...state.map, 
    ...state.auth.user, 
    ...state.badge, 
    ...state.demoAR 
  }
);

export default connect(mapStateToProps,
  {
    updateUserPosition,
    updateMapRegion,
    updateMarkers,
    updateMarkerIndex,
  })(MapViews);
