const functions = require('firebase-functions');
// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

const GeoFire = require('geofire');

let uid;
let currentLocation;
let allPortalsCompleted = [];

module.exports = (event) => {
  // triggers when there is an update to current_location in the database, such
  // as when a person moves the map. 
  event.geoFireMove = functions.database.ref('current_location').onUpdate(event => {
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('move_uid', uid);

    // grab current location from database
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      // console.log('snapshot of current location', currentLocation);
    }).catch(err => console.log(err))
    .then(() => {
      // this only returns the 1st key if there are many
      admin.database().ref(`portals_completed/${uid}`).once('value', snapshot => { 
        snapshot.forEach((child) => {
          let singlePortalCompleted = child.key;
          allPortalsCompleted.push(singlePortalCompleted);
          // console.log('single value', child.key);
        });
        // console.log('all value of portals completed', allPortalsCompleted);
      }).catch(err => console.log(err));
    })
    .then(() => {
      // Create a GeoFire index
      const geoFire = new GeoFire(admin.database().ref('geofire'));

      const geoQuery = geoFire.query({
        center: [34.047167, -118.443726],
        radius: 1
      });  
    
      geoQuery.updateCriteria({
        center: currentLocation,   // coordinates each time we move
        radius: 2                  // stays as is
      });
      
      // gathers fbLocations that are x distance from the center
      let locations = [];
      let openPortal = '';
      let portalKey = '';
      
      // fires when a key (name) moves from a location outside of this query
      // to one inside of it or when a key is written to GeoFire for the
      // first time and it falls within this query.
      const onKeyEnteredRegistration = geoQuery.on('key_entered', (key, location, distance) => { 
        // run through array of all portals completed and remove any if they match portals around current location
        if (allPortalsCompleted.indexOf(key) === -1) {
          locations.push(location);
        }
        // console.log('locations', locations);

        // signal client when near portal. distance <= 100 ft
        if (distance <= 0.03) { 
          openPortal = true;
          portalKey = key;
        }
      });
      
      // fires when a key (name) moves from a location inside of this query
      // to one outside of it. 
      const onKeyExitedRegistration = geoQuery.on('key_exited', (key, location, distance) => {
        // run through array of all portals completed and remove any if they match portals around current location
        if (allPortalsCompleted.indexOf(key) === -1) {
          locations.push(location);
        }
        // console.log('locations', locations);

        // signal client when near portal. distance <= 100 ft
        if (distance <= 0.03) { 
          openPortal = true;
          portalKey = key;
        }
      });

      // fires when a key which is already in this query moves to another location inside of it.
      const onKeyMovedRegistration = geoQuery.on('key_moved', (key, location, distance) => {
        // run through array of all portals completed and remove any if they match portals around current location
        if (allPortalsCompleted.indexOf(key) === -1) {
          locations.push(location);
        }
        // console.log('locations', locations);

        // signal client when near portal. distance <= 100 ft
        if (distance <= 0.03) { 
          openPortal = true;
          portalKey = key;
        }
      });    

      // 'ready' will fire again once each time updateCriteria() is called, after
      // all new data is loaded and all other new events have been fired. 
      const onReadyRegistration = geoQuery.on('ready', () => {
        // console.log('Moved - GeoQuery has loaded and fired all other events for initial data');
    
        // push nearby locations into the database.
        admin.database().ref(`location_config/${uid}`).set({ nearby_portal: locations });

        // push 'true' locations into the database. but this needs to be deleted afterwards. 
        admin.database().ref(`portal_open/${uid}`).update({ open_portal: openPortal });
        admin.database().ref(`portal_open/${uid}`).update({ portal_key: portalKey });          
        
        // Cancel the "key_entered" callback
        onKeyEnteredRegistration.cancel();
        // Cancel the "key_exited" callback
        onKeyExitedRegistration.cancel();
        // Cancel the "key_moved" callback
        onKeyMovedRegistration.cancel();

        // clear array
        allPortalsCompleted = [];
      });
    })
    .catch(err => console.log(err));
  });
};

                                              
/*
                                              
        _         *beep beep*           _     
       | ^                             | ^    
       |                               |      
       |        _____  ~~~~~~~~~~~~    |      
       |     __/ # # \__  ~~~~~~~~~~   |      
       |    [___________]  ~~~~~~~~~~  |      
*************(O)*****(O)************************ 

*/
