
/**
 * Module dependencies
 */
var context = require("../../library/context"),
    request = require("request"),
    _ = require("underscore");

/**
 * Module exports
 */
module.exports = function(app) {

    // for all routers of data
    app.get('/manager/data/administration', function(req, res) {
        return res.render('manager/data/administration', { context: context.get(req), doc: null });
    });






    app.post('/manager/data/index', function(req, res) {

        request.get("http://192.168.0.21:9200/site/category/_search", function(err, res, data) {

            if (res.statusCode == 200) {
                // to Object
                data = JSON.parse(data);
                var docs = [];

                if ((data.hits) && (data.hits.total > 0)) {
                    data.hits.hits.forEach(function(hit){

                        var xxx = "http://192.168.0.21:9200/site/category/" + hit._source.key;

                        request({method: "DELETE", url : xxx}, function(err, res, data){

                            var zzz = err;
                            var rrr = res;
                            var kkk = data;

                        });

                    });
                }


            }

        });

        return res.send("ok");

    });
    // for all routers of data


    app.get('/manager/store', function(req, res) {
        return res.render('manager/overview', { context: context.get(req), doc: null });
    });

    app.get('/manager/help', function(req, res) {
        return res.render('manager/overview', { context: context.get(req), doc: null });
    });

}
