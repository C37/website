
/**
 * Module dependencies
 */
var db = require("./database"),
    smtp = require("nodemailer");

/**
 * Typing
 */
exports.type = {
    access: {
        signin: 'signin',
        signout: 'signout'
    },
    system: {
        information: 'information',
        warning: 'warning',
        error: 'error'
    }
}

/**
 * Method Save
 */
exports.save = function(type, req, message, callback) {

    db.Logging(function(err, db){
        try {
            var logging;

            switch (type) {
                case "signin": {
                    logging = {
                        "doc_type": "access:" + type,
                        "created": new Date().toISOString(),
                        "uuid": req.session.user.uuid,
                        "ip": req.ip,
                        "referrer": req.headers["referer"],
                        "info": req.headers["user-agent"]
                    };
                    break;
                }
                default: break;
            }

            db.collection("signin", function(err, collection) {
                collection.insert(logging, function(err, doc) {
                    return (callback && typeof(callback) === "function") ? callback(null) : null;
                });

            })


        } catch (error) {
            return callback(error);
        }
    });

//    cb.connect(bucketSerLogging, function(err, bucket) {
//
//        try
//        {
//            var uuid = new Date().toISOString() + ":" + type;
//            var logging = null;
//
//            switch (type) {
//                case "signin": {
//                    logging = {
//                        "doc_type": "access:" + type,
//                        "created": new Date().toISOString(),
//                        "uuid": req.session.user.uuid,
//                        "ip": geoip.lookup(req.ip) ? geoip.lookup(req.ip) : req.ip,
//                        "referrer": req.headers["referer"],
//                        "info": req.headers["user-agent"]
//                    };
//                    break;
//                }
//                case "signout": {
//                    logging = {
//                        "doc_type": "access:" + type,
//                        "created": new Date().toISOString(),
//                        "uuid": req.session.user.uuid,
//                        "ip": geoip.lookup(req.ip) ? geoip.lookup(req.ip) : req.ip,
//                        "referrer": req.headers["referer"],
//                        "info": req.headers["user-agent"]
//                    };
//                    break;
//                }
//                case "delete": {
//                    logging = {
//                        "doc_type": "action:" + type,
//                        "created": new Date().toISOString(),
//                        "user": req.user.name,
//                        "doc": doc
//                    };
//                    break;
//                }
//                case "error": {
//
//                    break;
//                }
//                case "day": {
//                    logging = {
//                        "doc_type": "permission:" + type,
//                        "created": new Date().toISOString(),
//                        "ip": req.headers["host"],
//                        "referrer": req.headers["referer"],
//                        "user": {
//                            uuid: doc.uuid,
//                            name: doc.name,
//                            business: doc.responsibility.business,
//                            unit: doc.responsibility.unit
//                        }
//                    };
//                    break;
//                }
//                case "time": {
//                    logging = {
//                        "doc_type": "permission:" + type,
//                        "created": new Date().toISOString(),
//                        "ip": req.headers["host"],
//                        "referrer": req.headers["referer"],
//                        "user": {
//                            uuid: doc.uuid,
//                            name: doc.name,
//                            business: doc.responsibility.business,
//                            unit: doc.responsibility.unit
//                        }
//                    };
//                    break;
//                }
//                default: break;
//            }
//
//            bucket.set(uuid, logging, function(err, meta) {
//                if (!err) {
//                    return (callback && typeof(callback) === "function") ? callback(null) : null;
//                } else {
//                    var smtp = emailSmtp.createTransport("SMTP",{
//                        service: "Gmail",
//                        auth: {
//                            user: "no@c37.co",
//                            pass: "rili2009"
//                        }
//                    });
//
//                    var email = {
//                        from: "c37 ω <no@c37.co>", // sender address
//                        to: "lilo@c37.co", // list of receivers
//                        subject: "Sorrir & Viver - Ser - Error", // Subject line
//                        text: "Hello world ✔", // plaintext body
//                        html: "<b>Hello world ✔</b>" // html body
//                    }
//
//                    smtp.sendMail(email, function(error, response){
//                        if(error){
//                            console.log(error);
//                        }else{
//                            console.log("Message sent: " + response.message);
//                        }
//                    });
//                }
//            });
//
//        }
//        catch (error) {
//            return callback(error);
//        }
//
//    });

}