const functions = require('firebase-functions')
// modularizing firebase-admin
const admin = require('../config/fb-admin.js')

const GeoFire = require('geofire')


// the following should update geofire coordinates when the user moves and returns a set of coordinates based on the center

let currentLocation;
let uid;

module.exports = (event) => {
  
  // triggers when there is an update to current_location in the database, such
  // as when a person moves the map. 
  event.geoFireMove = functions.database.ref('current_location/').onUpdate(event => {
  
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('uid', uid);

    // grab current location from database
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      console.log ('snapshot of current location', currentLocation);
      // there shouldn't be a null since this function triggers when there's a chnage to the current location

    }).catch(err => console.log(err))
    .then(() => {
      
      let geoQuery; 

      geoQuery.updateCriteria({
        center: currentLocation,   // coordinates each time we move
        radius: 2                  // stays as is
      });
                  
      let locations = [];
      
      // fires when a key (name) moves from a location outside of this query to one inside of it or
      // when a key is written to GeoFire for the first time and it falls within this
      // query.
      let onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
        // if geofire key = portals completed then ignore, otherwise push. repeat for others.
        if (location !== functions.database.ref(`portals_completed_by_id/${uid}/{id}`)) {
          locations.push(location);
        };
        console.log(locations);
      });
      
      // fires when a key (name) moves from a location inside of this query to one outside of it. 
      let onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location, distance) {
        locations.push(location);
      });

      // fires when a key which is already in this query moves to another location inside of it.
      let onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
        locations.push(location);
      });    

      // 'ready' will fire again once each time updateCriteria() is called, after
      // all new data is loaded and all other new events have been fired. 
      let onReadyRegistration = geoQuery.on("ready", function() {
        console.log("GeoQuery has loaded and fired all other events for initial data");
    
        // Update state using the `locations` array
        console.log("near portals, inside ready", locations);
        
        // push nearby locations into the database. template literal baby!
        admin.database().ref(`location_config/${uid}`).set({nearby_portal: locations})
        
        // Cancel the "key_entered" callback
        onKeyEnteredRegistration.cancel();
        // Cancel the "key_exited" callback
        onKeyExitedRegistration.cancel();
        // Cancel the "key_moved" callback
        onKeyMovedRegistration.cancel();
      });
    }).catch(err => console.log(err))
  })
}
  
  
  
