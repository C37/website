
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
    app.get('/store', function(req, res) {
        res.render('store/overview', { definition: "", context: context.get(req) });
    });

}