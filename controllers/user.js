
/**
 * Module dependencies
 */
var context = require("./../library/context"),
    logging = require('./../library/logging'),
    model = require("../models/user");

/**
 * Module exports
 */
module.exports = function(app) {

    /**
     * Public methods
     */
    app.get('/signup', function(req, res) {
        model.Member().create(function(doc) {
            return res.render('user/signup', { context: context.get(req), doc: doc });
        })
    });

    app.post('/signup', function(req, res) {
        model.Member().save(req.body, null, function(validated_doc, validated_model) {
            if (validated_model) {
                return res.render('user/signup', { context: context.get(req), doc: validated_model });
            } else {
                // nova session para o novo member
                req.session.regenerate(function() {
                    //res.cookie("email", validated_doc.email, { signed: true });
                    req.session.member = validated_doc;

                    // logging === signin
                    //logging.save(logging.type.access, req, null)
                    return res.redirect("/");
                });
            }
        });
    });


    app.get('/signin', function(req, res) {
        model.Signin().create(function(doc) {
            return res.render('user/signin', { context: context.get(req), doc: doc });
        })
    });

    app.post('/signin', function(req, res) {
        model.Signin().authenticate(req.body, function(validated_doc, validated_model) {
            if (validated_model) {
                return res.render('user/signin', { context: context.get(req), doc: validated_model });
            } else {
                // nova session para o member
                req.session.regenerate(function() {
                    //res.cookie("email", validated_doc.email, { signed: true });
                    req.session.member = validated_doc;

                    // logging === signin
                    //logging.save(logging.type.access, req, null)
                    return res.redirect("/");
                });
            }
        });
    });

    app.get('/signout', function(req, res) {
        // logging === signout
        //logging.save(logging.type.access[1], req, null, function(error) {
            req.session.destroy(function() {
                res.clearCookie('email');
                res.redirect('/');
            });
        //});
    });



    app.get("/password", function(req, res) {
        res.render('user/password', { definition: "", context: context.get(req) });
    });

    app.post("/password", function(req, res) {
        res.render('user/password', { definition: "", context: context.get(req) });
    });



    app.get("/settings", function(req, res) {
        res.render("auth_password");
    });

    app.get("/access-history", function(req, res) {
        if (req.session.user) {
            rest.get("http://search-001.c37.co:9200/sv-ser-logging/_search?q=" + req.session.user.uuid).on("complete", function(data) {
                if (data.hits.total > 0) {

                    var uuids = [];
                    data.hits.hits.forEach(function(hit){ uuids.push(hit._id); })

                    db.serLogging(function(error, bucket) {
                        bucket.get(uuids, null, function(errors, docs, metas) {
                            docs = docs.sort(function(a,b) { return a.created < b.created}); // order === ASC

                            return res.send(docs);
                        });
                    });

                };
            });
        }
    });


}