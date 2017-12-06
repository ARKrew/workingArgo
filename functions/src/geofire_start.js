const functions = require('firebase-functions')
// modularizing firebase-admin
const admin = require('../config/fb-admin.js')

const GeoFire = require('geofire')

// the following takes portal coordinates and return a set of coordinates based
// on the center formatted for geoFire indexing

let fbLocation;
let uid;
let currentLocation;

module.exports = (event) => {
  // triggers when there is an update to users in the database.
  // onUpdate should be updated to onCreate once getCurrentLocation is applied
  event.geoFireStart = functions.database.ref('users').onUpdate(event => {
   
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log("uid", uid)

    // grab current location from database
    // try and refactor this under a separate function
    admin.database().ref(`location_config/${uid}/current_location`).once('value', snapshot => {
      currentLocation = snapshot.val();
      console.log ('snapshot of current location', currentLocation);
      // if null then ??

    }).catch(err => console.log(err))
    .then(() => {

      // grab all portal locations within the database
      admin.database().ref('/portal_coordinates_all').once('value', snapshot => { 
        fbLocation = snapshot.val(); 
        // console.log ("snapshot of location", fbLocation);
      }).then(() => {

        // Create a Firebase reference where GeoFire will store its information
        let firebaseRef = admin.database().ref('geofire');
        
        // Create a GeoFire index
        let geoFire = new GeoFire(firebaseRef);

        // create a geofire specific key for all portals in the database 
        geoFire.set(fbLocation)
        .then(() => {
          console.log("Provided key has been added to GeoFire");
        }).catch(err => console.log(err))
        .then(() => {
          // define what the center location is
          let geoQuery = geoFire.query({
            // swap lat/long coordinates w/ 'currentLocation'
            center: [34.047220, -118.443534], // zankou
            // center: [33.668648, -117.866387], // south coast benihana
            radius: 2
            // note: radius scale is km
          });
          
          // gathers fbLocations that are x distance from the center
          let locations = [];

          // fires when a key (name) moves from a location outside of this query to one inside of it or
          // when a key is written to GeoFire for the first time and it falls within this
          // query.
          let onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
            // let distanceInMiles = distance * 0.621;
            // console.log("enter", key + " entered query at " + location + " (" + distanceInMiles + " mi from center)");      
            locations.push(location);
          });
          
          // fires once when this query's initial state has been loaded from the server.
          // this will be used the most
          let onReadyRegistration = geoQuery.on("ready", function() {
            console.log("GeoQuery has loaded and fired all other events for initial data");
            
            // Update state using the `locations` array
            console.log("near portals, inside ready", locations);
            
            // push nearby locations into the database. template literal baby!
            admin.database().ref(`location_config/${uid}`).set({nearby_portal: locations})

            // Cancel the "key_entered" callback
            onKeyEnteredRegistration.cancel();
          });
             
        }).catch(err => console.log(err))
      })
    })
  })
}


