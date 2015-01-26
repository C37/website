
/**
 * Module dependencies
 */
var identifier = require('./identifier');


/**
 * Module exports
 */
module.exports = {

    /**
     * Public methods
     */
    get: function(req) {

        return {
                    user: req.session.user,
                    url: req.originalUrl,
                    now: new Date().toISOString(),
                    uuid: identifier
               }

    },
    set: function() {

    }

}