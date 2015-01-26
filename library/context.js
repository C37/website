
/**
 * Module dependencies
 */



/**
 * Module exports
 */
module.exports = {

    /**
     * Public methods
     */
    get: function(req) {

        return {
                    member: req.session.member,
                    url: req.originalUrl
               }

    },
    set: function() {

    }

}