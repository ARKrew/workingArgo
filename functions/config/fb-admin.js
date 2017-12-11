// this file was created to help modularize processes
// in particular this is for when we are calling firebase-admin


// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

module.exports = admin;



// Dependencies
// the following goes on pages that require firebase-admin
// =============================================================
// // modularizing firebase-admin
// const admin = require('../config/fb-admin.js');