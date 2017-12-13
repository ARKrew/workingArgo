const functions = require('firebase-functions');
// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

const GeoFire = require('geofire');

let uid;
let currentLocation;

module.exports = (event) => {
  // triggers when there is an update to current_location in the database, such
  // as when a person moves the map. 
  event.geoFirePortalCompleted = functions.database.ref('portals_completed').onUpdate(event => {
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('portal_completed_uid', uid);

    // grab current location from database
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      // console.log('snapshot of current location', currentLocation);
    }).catch(err => console.log(err))
    .then(() => {
      let allPortalsCompleted;
      // place in array all portals completed to be x-checked below.
      admin.database().ref(`portals_completed/${uid}`).once('value', snapshot => { 
        allPortalsCompleted = [];
        snapshot.forEach(child => {
          let singlePortalCompleted = child.key;
          allPortalsCompleted.push(singlePortalCompleted);
          // console.log(uid, 'single portal completed-1', singlePortalCompleted);          
        });
        // console.log(uid, 'all portals completed-1', allPortalsCompleted);
        return allPortalsCompleted;
      // }).catch(err => console.log(err));
      // console.log(uid, 'all portals completed-1.5', allPortalsCompleted);
      })
      .then(() => {
        // console.log(uid, 'all portals completed-2', allPortalsCompleted);
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
          // console.log(uid, ': move key_entered: ', allPortalsCompleted);
          
          // run through array of all portals completed and remove any if they match portals around current location
          if (allPortalsCompleted.indexOf(key) === -1) {
            locations.push({ key, location });
            // signal client when near portal. distance <= 100 ft.
            if (distance <= 0.03) { 
              openPortal = true;
              portalKey = key;
            }
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
        });
      })
      .catch(err => console.log(err));
    });
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
