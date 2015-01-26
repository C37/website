
/**
 * Module dependencies
 */
var crypto = require('crypto');

/**
 * Method exports
 */
exports.make_hash = function(password) {

    return crypto.pbkdf2Sync(password, 'uuFkuLaIoJpj1gScTVUPmC9IA4fIBcGH2jd', 12000, 128);

};