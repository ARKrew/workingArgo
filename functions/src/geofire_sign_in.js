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
  event.geoFireSignIn = functions.database.ref('users').onUpdate(event => {
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('sign-in_uid', `${uid}`);
    
    // grab current location from database
    // try and refactor this under a separate function
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      // console.log('snapshot of current location', currentLocation);
    }).catch(err => console.log(err))
    
    .then(() => {
      // grab all portal locations within the database
      admin.database().ref('/portal_coordinates_all').once('value', snapshot => { 
        fbLocation = snapshot.val(); 
        // console.log ("snapshot of location", fbLocation);
      })
    .then(() => {
      let allPortalsCompleted;
      // place in array all portals completed to be x-checked below
      admin.database().ref(`portals_completed/${uid}`).once('value', snapshot => { 
        allPortalsCompleted = [];
        snapshot.forEach(child => {
          let singlePortalCompleted = child.key;
          allPortalsCompleted.push(singlePortalCompleted);
          // console.log('sign-in: single value', child.key);
        });
        // console.log('sign-in: all value of portals completed', allPortalsCompleted);
        return allPortalsCompleted;
      })
        .then(() => {
          // Create a Firebase reference where GeoFire will store its information
          const firebaseRef = admin.database().ref('geofire');
          
          // Create a GeoFire index
          const geoFire = new GeoFire(firebaseRef);

          // create a geofire specific key for all portals in the database 
          geoFire.set(fbLocation)
          .then(() => {
            // console.log('Provided key has been added to GeoFire');
          }).catch(err => console.log(err))
          .then(() => {
            // define what the center location is
            const geoQuery = geoFire.query({
              center: currentLocation,
              radius: 2
              // note: radius scale is km
              // 2 km = 1.2 mi
            });
            
            // gathers fbLocations that are x distance from the center
            let locations = [];
            let openPortal = '';
            let portalKey = '';

            // fires when a key (name) moves from a location outside of this query to one inside of it or
            // when a key is written to GeoFire for the first time and it falls within this
            // query.
            const onKeyEnteredRegistration = geoQuery.on('key_entered', (key, location, distance) => {
              // run through array of all portals completed and remove any if they match portals around current location
              // console.log('sign-in: all portals completed', allPortalsCompleted);
              if (allPortalsCompleted.indexOf(key) === -1) {
                locations.push({ key, location });
                // signal client when near portal. distance <= 100 ft.
                if (distance <= 0.03) { 
                  openPortal = true;
                  portalKey = key;
                }
              }

              // clear array
              // allPortalsCompleted = [];

            });

            // fires once when this query's initial state has been loaded from the server.
            // this will be used the most
            const onReadyRegistration = geoQuery.on('ready', () => {
              // console.log('New - GeoQuery has loaded and fired all other events for initial data');
              
              // console.log('near portals, inside ready', locations);
              
              // push nearby locations into the database. template literal baby!
              admin.database().ref(`location_config/${uid}`).set({ nearby_portal: locations });

              // push 'true' locations into the database. but this needs to be deleted afterwards. 
              admin.database().ref(`portal_open/${uid}`).update({ open_portal: openPortal });
              admin.database().ref(`portal_open/${uid}`).update({ portal_key: portalKey });          

              // Cancel the "key_entered" callback
              onKeyEnteredRegistration.cancel();

            });

            // ---------- comment out below when not needed ----------
            // -------------- use when removing portals --------------
            // -------------------------------------------------------
            // geoFire.remove('-L-mBAofN07Tat0U4ICB').then(() => {
            //   console.log('Provided key removed from GeoFire');
            // }, (error) => {
            //   console.log('Error: ' + error);
            // });
            // -------------------------------------------------------
            // ---------- comment out above when not needed ----------

          })
          .catch(err => console.log(err));
        });
      });
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
