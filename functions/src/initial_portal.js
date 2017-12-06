const functions = require('firebase-functions')
// modularizing firebase-admin
const admin = require('../config/fb-admin.js')

const GeoFire = require('geofire')

// the following takes portal coordinates and return a set of coordinates based
// on the center formatted for geoFire indexing

let uid;
let currentLocation;

module.exports = (event) => {
  // triggers when there is an update to users in the database.
  // onUpdate should be updated to onCreate once getCurrentLocation is applied
  event.initialPortal = functions.database.ref('users').onUpdate(event => {
   
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

      // admin.database().ref('/portal_coordinates_all').once('value', snapshot =>{ 
      //   let allLoc = [];
      //   snapshot.forEach(child => {
      //     let singleLoc = [];
      //     singleLoc.push(child.val().latitude)
      //     singleLoc.push(child.val().longitude)
      //     allLoc.push(singleLoc)
      //   });

      let latitude = currentLocation.val([0])
      let longitude = currentLocation.val([1])
      console.log(latitude)
      console.log(longitude)

      latitude = latitude + 0.000010;

      let initialPortal = [];

      initialPortal.push(latitude)
      initialPortal.push(longitude) 

      // set initial portal location within the database
      admin.database().ref(`/initial_portal/${uid}/`).set(initialPortal)   
             
    })
  }).catch(err => console.log(err))
}


