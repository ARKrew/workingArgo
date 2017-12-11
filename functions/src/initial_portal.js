const functions = require('firebase-functions');
// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

// the following takes portal coordinates and return a set of coordinates based
// on the center formatted for geoFire indexing

let uid;
let currentLocation = [];

module.exports = (event) => {
  // triggers when there is an update to users in the database.
  // onUpdate should be updated to onCreate once getCurrentLocation is applied
  event.initialPortal = functions.database.ref('users').onUpdate(event => {
    // this grabs the user's uid
    uid = event.auth.variable ? event.auth.variable.uid : null;
    console.log('initial_uid', uid);

    // grab current location from database
    // try and refactor this under a separate function
    admin.database().ref(`current_location/${uid}/currentLocation`).once('value', snapshot => {
      currentLocation = snapshot.val();
      // console.log ('snapshot of current location', currentLocation);
    }).catch(err => console.log(err))
    .then(() => {
      
      let initialPortalCompleted;

      admin.database().ref(`initial_portal/${uid}`).child('completed').once('value', snapshot => {
        initialPortalCompleted = snapshot.val();
        // console.log('initial portal completed?', initialPortalCompleted);
        
        if (initialPortalCompleted !== true) {
          let latitude = currentLocation[0];
          let longitude = currentLocation[1];
    
          // moving portal approximately 3 ft away
          latitude += 0.000010;
    
          let initialPortal = [];
    
          initialPortal.push(latitude);
          initialPortal.push(longitude);
          // console.log('initial portal', initialPortal);
  
          // set initial portal location within the database
          admin.database().ref(`initial_portal/${uid}/location`).set(initialPortal);
        } else {
        return null;
        }
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
