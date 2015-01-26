
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

    app.get('/lilo', function(req, res) {
        res.render('lilo/overview', { definition: "", context: context.get(req) });
    });

    app.get('/lilo/what-for', function(req, res) {
        res.render('lilo/what-for', { definition: "", context: context.get(req) });
    });

    app.get('/lilo/design', function(req, res) {
        res.render('lilo/design', { definition: "", context: context.get(req) });
    });

    app.get('/lilo/versions', function(req, res) {
        res.render('lilo/version', { definition: "", context: context.get(req) });
    });

    app.get('/lilo/specifications', function(req, res) {
        res.render('lilo/specification', { definition: "", context: context.get(req) });
    });

}