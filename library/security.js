
/**
 * Module dependencies
 */
var crypto = require('crypto'),
    settings = require('./../settings');

/**
 * Method exports
 */
exports.make_hash = function(password) {

    return crypto.pbkdf2Sync(password, settings.private_key, 12000, 128);

};

exports.make_token = function(password) {

    return true;

};

exports.validate_token = function(token) {

    return (settings.private_key == token);

};