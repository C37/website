
/**
 * Module dependencies
 */
var express = require("express"),
    http = require("http"),
    path = require("path"),
    app = express();

// Express
app.set("port", 5000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.set('view options', { layout: false });
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("cXcdoIfae9apj5rs5oX09LHwDwn9Eky9MpU"));
app.use(express.session());
app.use(express.compress());
app.use(express.static(path.join(__dirname, "/public")));
app.use(app.router);

// Routes
require("./routers")(app);

/**
 * Start Application
 */
http.createServer(app).listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});