'use strict';

const functions = require('firebase-functions');

// // Include a Service Account Key to use a Signed URL
const gcs = require('@google-cloud/storage')({ keyFilename: 'argo-4cbff-firebase-adminsdk-1ft9p-5a78f16f28.json' });

// this allows the ImageMagick CLI to run
// ImageMagick is already provided by Cloud Functions
// spawn method loads and executes an external application in a new process
const spawn = require('child-process-promise').spawn;

// modularizing firebase-admin
const admin = require('../config/fb-admin.js');

/*
* When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
* ImageMagick.
* After the thumbnail has been generated and uploaded to Cloud Storage,
* we write the public URL to the Firebase Realtime Database.
*/

module.exports = (event) => {
  event.generateThumbnail = functions.storage.object().onChange(event => {
    // File and directory paths.
    const object = event.data; 
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const fileBucket = object.bucket;
    // Cloud Storage files.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = `/tmp/${fileName}`;
    // reference the root of the database
    const ref = admin.database().ref();
    // get the file object for the original image in order to get the signed url
    const file = bucket.file(filePath);
    // the const will hold the filepath for the thumbnail 
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$2_thumb$1');

    if (fileName.endsWith('_thumb')) {
      console.log('Already a Thumbnail.');
      return;
    }  

    // Exit if this is triggered on a file that is not an image.
    if (!object.contentType.startsWith('image/')) {
      console.log('This is not an image.');
      return;
    }
    
    // Exit if this is a move or deletion event.
    if (object.resourceState === 'not_exists') {
      console.log('This is a deletion event.');
      return;
    }

    return bucket.file(filePath).download({
      destination: tempFilePath
    })
    .then(() => {
      console.log('Image downloaded locally to ', tempFilePath);
      // '>' keeps the images aspect ratio
      return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);           
    })
    .then(() => {
      console.log('Thumbnail created');
      return bucket.upload(tempFilePath, {
        destination: thumbFilePath
      });
    // add reference to the db once img is stored to cloud storage
    })
    .then(() => {
      // start with file method for the thumbnail img
      const thumbFile = bucket.file(thumbFilePath);
      // create const to hold values of action & expires when getSignedUrl gets called
      const config = {
        action: 'read',
        expires: '03-09-2400'
      };
      // return a promise when fulfilled that will call getSignedUrl concurrently 
      // this will return an array with two elements (urls)
      return Promise.all([
        // call the getSignedUrl of the thumbFile object (thumbnail image)
        thumbFile.getSignedUrl(config),
        // call the getSignedUrl of the file object (original image)
        file.getSignedUrl(config)
      ]);
    // once i have an arrary of promises, get the signed urls and write them to the db
    })
    .then(results => {
      // first promise is from the thumbnail
      const thumbResult = results[0];
      // second promise is from the original image
      const originalResult = results[1];
      // each promise returns an array with a signed img url as the first element
      const thumbFileUrl = thumbResult[0];
      const fileUrl = originalResult[0];
      // from the root of the database defined as 'ref' above, we go into the
      // child, named 'posts' push id created by the method push. set the value
      // of this new reference with the key/value pairs
      return ref.child('portal_images').push({ original: fileUrl, thumbnail: thumbFileUrl });
    });
  });
};
