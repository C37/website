
/**
 * Module dependencies
 */
var context = require("../library/context");

/**
 * Module exports
 */
module.exports = function(app) {

    /**
     * Public methods
     */

    app.get('/rizu', function(req, res) {
        res.render('rizu/overview', { definition: "", context: context.get(req) });
    });

    app.get('/rizu/what-for', function(req, res) {
        res.render('rizu/what-for', { definition: "", context: context.get(req) });
    });

    app.get('/rizu/design', function(req, res) {
        res.render('rizu/design', { definition: "", context: context.get(req) });
    });

    app.get('/rizu/versions', function(req, res) {
        res.render('rizu/version', { definition: "", context: context.get(req) });
    });

    app.get('/rizu/specifications', function(req, res) {
        res.render('rizu/specification', { definition: "", context: context.get(req) });
    });

    app.get('/rizu/accessories', function(req, res) {
        res.render('rizu/accessory', { definition: "", context: context.get(req) });
    });

}