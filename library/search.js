
/**
 * Module dependencies
 */
var db = require("./data_index"),
    rest = require("restler"),
    context = require("./context");

/**
 * Module exports
 */
module.exports = function(app) {

    /**
     * Public methods
     */
    app.get("/search/cep", function(req, res) {

        if (req.query["term"] != "") {

            rest.get("http://search-001.c37.co:9200/cep/_search?q=" + req.query["term"] + "&size=15").on("complete", function(data) {
                if (data.hits.total > 0) {

                    var uuids = [];
                    data.hits.hits.forEach(function(hit){ uuids.push(hit._id); })

                    db.cep(function(err, bucket){
                        bucket.get(uuids, null, function (errs, docs, metas) {
                            return res.send(docs);
                        });
                    });

                } else {
                    return res.send("");
                }
            });

        } else {
            return res.send("");
        }

    });

    app.get("/search/location", function(req, res) {

        if (req.query["term"] != "") {

            rest.get("http://search-001.c37.co:9200/cep/_search?q=" + req.query["term"] + "&size=15").on("complete", function(data) {
                if (data.hits.total > 0) {

                    var uuids = [];
                    data.hits.hits.forEach(function(hit){ uuids.push(hit._id); })

                    db.cep(function(err, bucket){
                        bucket.get(uuids, null, function (errs, docs, metas) {
                            return res.send(docs);
                        });
                    });

                } else {
                    return res.send("");
                }
            });

        } else {
            return res.send("");
        }

    });

    app.get("/search/occupation", function(req, res) {

        if (req.query["term"] != "") {

            rest.get("http://search-001.c37.co:9200/cbo/_search?q=" + req.query["term"] + "&size=15").on("complete", function(data) {
                if (data.hits.total > 0) {

                    var uuids = [];
                    data.hits.hits.forEach(function(hit){ uuids.push(hit._id); })

                    db.cbo(function(err, bucket){
                        bucket.get(uuids, null, function (errs, docs, metas) {
                            res.send(docs);
                        });
                    });

                } else {
                    return res.send("");
                }
            });

        } else {
            return res.send("");
        }

    });

    app.get("/search/patient", function(req, res) {

        if (req.query["term"] != "") {

            var xxx = '{"query":{"filtered":{"query":{"query_string":{"query":"' + req.query["term"] + '"}},"filter":{"bool":{"must":{"term":{"doc_type":"patient"}},"must":{"term":{"business":"' + context.get(req).business.toLowerCase() + '"}%search_patient_unit%}}}}}}';

            if ((context.get(req).business.search_patient_unit) && (context.get(req).business.search_patient_unit === "on")) {
                xxx = xxx.replace("%search_patient_unit%", ',"must":{"term":{"unit":"' + context.get(req).unit.toLowerCase() + '"}}');
            } else {
                xxx = xxx.replace("%search_patient_unit%", "");
            }

            rest.get("http://search-001.c37.co:9200/sv-ser-data/_search",{data: xxx}).on("complete", function(data) {
                if (data.hits.total > 0) {

                    var uuids = [];
                    data.hits.hits.forEach(function(hit){ uuids.push(hit._id); })

                    db.serData(function(err, bucket){
                        bucket.get(uuids, null, function (errs, docs, metas) {
                            res.send(docs);
                        });
                    });

                } else {
                    return res.send("");
                }
            });

        } else {
            return res.send("");
        }

    });

}