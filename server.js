//Require serve-me package
var ServeMe = require('serve-me');

//*******************************
// HTTP SERVER
// Only server the html & other files
//*******************************
var port = 3000;
var options = {
    home: "index.html",
    directory: "public",
    debug: false,
    log: true,
    secure: false,
    cache: false
};

//Start the Server
ServeMe = ServeMe(options, port);
ServeMe.start();