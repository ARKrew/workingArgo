const functions = require('firebase-functions');
// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

const GeoFire = require('geofire');


let fbLocation;
let uid;
let currentLocation;

module.exports = (event) => {
  // triggers when there is an update to current_location in the database, such
  // as when a person moves the map. 
  event.geoFireMoveUnused = functions.database.ref('user').onUpdate(event => {
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('uid', uid);

    // grab current location from database
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      console.log('snapshot of current location', currentLocation);
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
            center: currentLocation, 
            radius: 2
            // note: radius scale is km
          });
          
          // gathers fbLocations that are x distance from the center
          const locations = [];

          // fires when a key (name) moves from a location outside of this query
          // to one inside of it or when a key is written to GeoFire for the
          // first time and it falls within this query.
          const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance) {
            // if (location !== functions.database.ref(`portals_completed_by_id/${uid}/{id}`)) {
              locations.push(location);
            // };
            console.log(locations);
          });
          /*
          // fires when a key (name) moves from a location inside of this query
          // to one outside of it. 
          const onKeyExitedRegistration = geoQuery.on('key_exited', (key, location, distance) => {
            locations.push(location);
          });

          // fires when a key which is already in this query moves to another location inside of it.
          const onKeyMovedRegistration = geoQuery.on('key_moved', (key, location, distance) => {
            locations.push(location);
          });  
          */  

          // 'ready' will fire again once each time updateCriteria() is called, after
          // all new data is loaded and all other new events have been fired. 
          const onReadyRegistration = geoQuery.on('ready', function() {
            console.log('GeoQuery has loaded and fired all other events for initial data');
        
            // Update state using the `locations` array
            console.log('near portals, inside ready', locations);
            
            // push nearby locations into the database. template literal baby!
            admin.database().ref(`location_config/${uid}`).set({ nearby_portal: locations });
            
            // Cancel the "key_entered" callback
            onKeyEnteredRegistration.cancel();
            // // Cancel the "key_exited" callback
            // onKeyExitedRegistration.cancel();
            // // Cancel the "key_moved" callback
            // onKeyMovedRegistration.cancel();
          });
        })
        .catch(err => console.log(err));
      });
    });
  });
};

