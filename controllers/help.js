
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
   app.get('/help', function(req, res) {
        res.render('help/overview', { definition: "", context: context.get(req) });
    });
}