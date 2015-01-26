
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

    app.get('/rili', function(req, res) {
        res.render('rili/overview', { definition: "", context: context.get(req) });
    });

    app.get('/rili/what-for', function(req, res) {
        res.render('rili/what-for', { definition: "", context: context.get(req) });
    });

    app.get('/rili/design', function(req, res) {
        res.render('rili/design', { definition: "", context: context.get(req) });
    });

    app.get('/rili/versions', function(req, res) {
        res.render('rili/version', { definition: "", context: context.get(req) });
    });

    app.get('/rili/specifications', function(req, res) {
        res.render('rili/specification', { definition: "", context: context.get(req) });
    });

}