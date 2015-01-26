
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
   app.get('/suport', function(req, res) {
        res.render('suport/overview', { definition: "", context: context.get(req) });
    });
}