// modularizing firebase-admin
const admin = require("./config/fb-admin.js");

require('./src/geofire_start.js')(module.exports);
// require('./src/geofire_move.js')(module.exports);
// require('./src/image_upload.js')(module.exports);
// require('./src/initial_portal.js')(module.exports);
