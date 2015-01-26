
/**
 * Module dependencies
 */
var db = require("./data_index"),
    fs = require("fs");

/**
 * Module exports
 */
module.exports = function(app) {

    /**
     * Public methods
     */
    app.get("/file/image/:uuid", function(req, res) {

        var uuid = req.params["uuid"];

        db.serImage(function(err, bucket){
            bucket.get(uuid + ":image", function (err, doc, meta) {
                if (doc) {
                    res.writeHead(200, {"Content-Type": doc.type });
                    res.end(new Buffer(doc.data, "base64"));
                } else {
                    fs.readFile("./public/img/sv.risinho.png", function (err, data) {
                        res.writeHead(200, {"Content-Type": "image/png" });
                        res.end(data);
                    });
                }
            });
        });

    });

    app.post("/file/image/:uuid", function(req, res) {

        if (req.files.files[0].type.indexOf("png") >= 0 || req.files.files[0].type.indexOf("jpg") >= 0 || req.files.files[0].type.indexOf("jpeg") >= 0) {
            if (req.files.files[0].size <= 1000000) {

                fs.readFile(req.files.files[0].path, function (err, data) {

                    db.serImage(function(err, bucket) {

                        var uuid = req.params["uuid"];
                        var image = {
                            type: req.files.files[0].type,
                            data: new Buffer(data).toString("base64")
                        }

                        bucket.set(uuid + ":image", image, function(err, meta) {
                            if (!err) {
                                res.send("success");
                            } else {
                                res.send("error");
                            }
                        });

                    });

                });

            } else {
                res.send("error");
            }
        } else {
            res.send("error");
        }

    });

}
