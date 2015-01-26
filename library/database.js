
/**
 * Module dependencies
 */
var mongodb = require('mongodb'),
    settings = require('../settings'),
    format = require('util').format;

/**
 * Module exports
 */
module.exports = {
    keyCreate: function() {
        return new mongodb.ObjectID().toString();
    },
    User: function(callback) {
        mongodb.Db.connect(format("mongodb://%s/%s?w=1", settings.db.User.hosts, settings.db.User.database), callback );
    },
    Site: function(callback) {
        mongodb.Db.connect(format("mongodb://%s/%s?w=1", settings.db.Site.hosts, settings.db.Site.database), callback );
    },
    Version: function(callback) {
        mongodb.Db.connect(format("mongodb://%s/%s?w=1", settings.db.Version.hosts, settings.db.Version.database), callback );
    },
    Logging: function(callback) {
        mongodb.Db.connect(format("mongodb://%s/%s?w=1", settings.db.Logging.hosts, settings.db.Logging.database), callback );
    }
}