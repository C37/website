/**
 * Module dependencies
 */
var context = require("./library/context");

/**
 * Routes
 */
module.exports = function (app) {

    // error - 404 not found
    app.use(function (req, res, next) {
        res.status(404);
        // logging
        return res.render("error/404", { context: context.get(req) });
    });

    // error - 500 internal server error
    app.use(function (err, req, res, next) {
        res.status(500);
        // logging
        return res.render("error/500", { error: err, context: context.get(req) });
    });

    /*
     * Form all methods in manager+
     */
    app.all('/manager*', function(req, res, next) {
        if ((context.get(req).user) && (context.get(req).user.employee) && (context.get(req).user.employee == true)) {
            next();
        } else {
            return res.redirect('/');
        }
    });

    /*
     * For Get overview in manager
     */
    app.get('/manager', function(req, res) {
        return res.render('manager/overview', { context: context.get(req), doc: null });
    });

    /*
     * For another manager
     */
    require("./controllers/manager/data")(app);
    require("./controllers/manager/education")(app);


    // in Library
    // require("./library/search")(app);
    // require("./library/file")(app)

    // in Controllers
    require("./controllers/user")(app);
    require("./controllers/rizu")(app);
    require("./controllers/lilo")(app);
    require("./controllers/rili")(app);
    require("./controllers/education")(app);
    require("./controllers/store")(app);
    require("./controllers/help")(app);

    // in Overview
    app.get('/', function (req, res) {
        return res.render("overview", { context: context.get(req) });
    });

    app.get('/cookie', function (req, res) {
        return res.render("policy/cookie", { context: context.get(req) });
    });

    app.get('/sitemap', function (req, res) {
        return res.render("policy/sitemap", { context: context.get(req) });
    });

    app.get('/term', function (req, res) {
        return res.render("policy/term", { context: context.get(req) });
    });

    app.get('/privacy', function (req, res) {
        return res.render("policy/privacy", { context: context.get(req) });
    });

};
