const functions = require('firebase-functions');
// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

const GeoFire = require('geofire');

// the following takes portal coordinates and return a set of coordinates based
// on the center formatted for geoFire indexing

let fbLocation;
let uid;
let currentLocation;

module.exports = (event) => {
  // triggers when there is an update to users in the database.
  // onUpdate should be updated to onCreate once getCurrentLocation is applied
  event.geoFireStart = functions.database.ref('current_location').onUpdate(event => {
   
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('uid', `${uid}`);

    // grab current location from database
    // try and refactor this under a separate function
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      console.log('snapshot of current location', currentLocation);
      // if null then ??
    }).catch(err => console.log(err))

    .then(() => {
      // grab all portal locations within the database
      admin.database().ref('/portal_coordinates_all').once('value', snapshot => { 
        fbLocation = snapshot.val(); 
        // console.log ("snapshot of location", fbLocation);
      })
      .then(() => {
        // Create a Firebase reference where GeoFire will store its information
        const firebaseRef = admin.database().ref('geofire');
        
        // Create a GeoFire index
        const geoFire = new GeoFire(firebaseRef);

        // create a geofire specific key for all portals in the database 
        geoFire.set(fbLocation)
        .then(() => {
          console.log('Provided key has been added to GeoFire');
        }).catch(err => console.log(err))
        .then(() => {
          // define what the center location is
          const geoQuery = geoFire.query({
            // swap lat/long coordinates w/ 'currentLocation'
            center: currentLocation, // zankou
            // center: [33.668648, -117.866387], // south coast benihana
            radius: 2
            // note: radius scale is km
          });

          geoQuery.updateCriteria({
            center: currentLocation,   // coordinates each time we move
            radius: 2                  // stays as is
          });
          
          // gathers fbLocations that are x distance from the center
          const locations = [];

          // fires when a key (name) moves from a location outside of this query to one inside of it or
          // when a key is written to GeoFire for the first time and it falls within this
          // query.
          const onKeyEnteredRegistration = geoQuery.on('key_entered', (key, location, distance) => {
            // let distanceInMiles = distance * 0.621;
            // console.log("enter", key + " entered query at " + location + " (" + distanceInMiles + " mi from center)");      
            locations.push(location);
          });

          // fires when a key (name) moves from a location inside of this query to one outside of it. 
          const onKeyExitedRegistration = geoQuery.on('key_exited', (key, location, distance) => {
            locations.push(location);
          });

          // fires when a key which is already in this query moves to another location inside of it.
          const onKeyMovedRegistration = geoQuery.on('key_moved', (key, location, distance) => {
            locations.push(location);
          }); 
          
          // fires once when this query's initial state has been loaded from the server.
          // this will be used the most
          const onReadyRegistration = geoQuery.on('ready', () => {
            console.log('GeoQuery has loaded and fired all other events for initial data');
            
            // Update state using the `locations` array
            console.log('near portals, inside ready', locations);
            
            // push nearby locations into the database. template literal baby!
            admin.database().ref(`location_config/${uid}`).set({ nearby_portal: locations })

            // Cancel the "key_entered" callback
            onKeyEnteredRegistration.cancel();
            // Cancel the "key_exited" callback
            onKeyExitedRegistration.cancel();
            // Cancel the "key_moved" callback
            onKeyMovedRegistration.cancel();
          });
        })
        .catch(err => console.log(err));
      });
    });
  });
};

