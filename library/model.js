/**
 * Module dependencies
 */
var util = require("util"),
    async = require("async"),
    request = require("request"),
    _ = require("underscore"),
    security = require("./security")

module.exports = {

    Base: {
        definition: function (callback) {
            return callback(this)
        },
        load: function (key, context, callback) {

            var model = this,
                url = util.format("http://%s/%s/%s/_search?q=key:%s", model.data_index.hosts, model.data_index.index, model.type, key)

            request.get(url, function(err, res, data) {

                if (res.statusCode == 200) {
                    // to Object
                    data = JSON.parse(data)

                    if (data.hits.total == 1) { // doc with key found

                        var doc = data.hits.hits[0]._source

                        model.fields.forEach(function (field) {
                            field.value = doc[field.name]
                        })

                    } else { // automatic new doc
                        model.isNew = true;

                        _.findWhere(model.fields, { name: "key" }).value = key
                        _.findWhere(model.fields, { name: "created" }).value = new Date().toISOString()
                        // for new self user!
                        if (_.findWhere(model.fields, { name: "user" })) {
                            _.findWhere(model.fields, { name: "user" }).value = context.user.name_user
                        }
                    }
                    return callback(model)
                }
            })
        },
        relationship: function (options, callback) {

            var model = this,
                relationships = []


            if (model.relationships.length >= 1) {
                if ((options == undefined) || (options == null) || (options == '')) {
                    async.each(model.relationships, function (relationship, callback) {

                        var url = util.format("http://%s/%s/%s/_search?size=50", model.data_index.hosts, model.data_index.index, relationship)

                        request.get(url, function (err, res, data) {
                            // 200 Ok
                            if (res.statusCode == 200) {
                                // to Object
                                data = JSON.parse(data);

                                if (data.hits.total >= 1) {
                                    var docs = []
                                    // para cada hit
                                    data.hits.hits.forEach(function (hit) {
                                        docs.push(hit._source)
                                    })
                                    // order by field_order
                                    docs = _.sortBy(docs, function (doc) { return doc[model.field_order] })

                                    // inserindo no Array de relacionamento por tipo
                                    relationships[relationship] = docs

                                    callback(undefined)
                                }
                            }
                        })
                    }, function (error) {
                        return callback(relationships, error)
                    })

                }
            } else {
                return callback(relationships, null)
            }
        },
        find: function (query, callback) {

            var model = this,
                query_str = '',
                url = util.format("http://%s/%s/%s/_search", model.data_index.hosts, model.data_index.index, model.type)

            query_str = '{"query":{"bool":{"must":['

            for (var property in query) {
                query_str = query_str + util.format('{"match_phrase":{"%s":"%s"}}', property, query[property])
            }

            query_str = query_str + ']}},size: 50}'

            request.get(url, { body: query_str}, function (err, res, data) {
                // 200 Ok
                if (res.statusCode == 200) {
                    // to Object
                    data = JSON.parse(data)
                    var docs = []

                    if (data.hits.total > 0) {
                        data.hits.hits.forEach(function (hit) {
                            docs.push(hit._source)
                        })
                        // order by field_order
                        docs = _.sortBy(docs, function (doc) { return doc[model.field_order] })
                    }
                    return callback(docs)
                }
            })

        },
        pagination: function (page_number, callback) {

            var model = this

            model.data_index(function (err, data_index) {
                var collection = data_index.collection(model.type)

                collection.find().toArray(function (err, docs) {
                    return callback(docs)
                })
            })
        },
        save: function (doc, callback) {

            var model = this

            validate(doc, model, function (validated_doc, validated_model) {

                if (validated_model.validate_message.length <= 0) {

                    // clear isNew
                    delete  validated_doc["isNew"]

                    // protocol + host:port + index + type + uuid
                    var url = util.format("http://%s/%s/%s/%s", model.data_index.hosts, model.data_index.index, model.type, validated_doc.key),
                        data = JSON.stringify(validated_doc)

                    request.put(url, { body: data }, function (err, res, data) {

                        // 201 Created || 200 Ok = Update
                        if ((res.statusCode == 201) || (res.statusCode == 200)) {
                            return callback(validated_doc, null)
                        }

                    })

                } else {
                    return callback(null, validated_model)
                }

            })
        },
        delete: function (key, callback) {

            var model = this,
                url = util.format("http://%s/%s/%s/%s", model.data_index.hosts, model.data_index.index, model.type, key)

            request({method: "DELETE", url: url}, function (err, res, data) {

                var zzz = err
                var rrr = res
                var kkk = data

                return callback(err)

            })


        },
        authenticate: function (doc, callback) {

            var model = this

            validate(doc, model, function (validated_doc, validated_model) {

                if (validated_model.validate_message.length <= 0) {

                    var url = util.format("http://%s/%s/%s/_search?", validated_model.data_index.hosts, validated_model.data_index.index, validated_model.type),
                        query_str = '{"filter":{"or":[{"term":{"name_user":"%s"}},{"term":{"email":"%s" }}]}}',
                        query = util.format(query_str, validated_doc.name_user_email, validated_doc.name_user_email)

                    request.get(url, {body: query}, function (err, res, data) {

                        if (res.statusCode == 200) {
                            // to Object
                            data = JSON.parse(data)

                            if ((data.hits) && (data.hits.total > 0)) {

                                var password_hash = security.make_hash(validated_doc.password).toString('hex')
                                var member = data.hits.hits[0]._source

                                if (member.password == password_hash) {
                                    return callback(member, null)
                                } else {
                                    validated_model.validate_message.push("A senha informada não está correta")
                                    return callback(null, validated_model)
                                }

                            } else {
                                validated_model.validate_message.push("O usuário informado não foi encontrado")
                                return callback(null, validated_model)
                            }
                        }

                    })

                } else {
                    return callback(null, validated_model)
                }

            })
        }
    }
}


function validate(validate_doc, validate_model, callback) {

    // For state persistence of New document
    if (validate_doc.isNew) {
        validate_model.isNew = true
    }

    // para cada field em validate_model
    async.each(validate_model.fields, function (field, call_field) {

        // preenche o valor para o retorno de validate_model para a view
        field.value = validate_doc[field.name]

        // tipos de validação para cada field
        async.each(field.validate, function (validate_type, call_validate) {

            if (validate_type == 'required') {

                if (validate_doc[field.name] === '' || validate_doc[field.name] === null || validate_doc[field.name] === undefined) {
                    validate_model.validate_message.push(util.format("O campo %s é necessário", field.display))
                }
                call_validate()

            } else if (validate_type == 'unique') {

                if (validate_doc[field.name] != '') {

                    var url = util.format("http://%s/%s/%s/_search", validate_model.data_index.hosts, validate_model.data_index.index, validate_model.type),
                        query = util.format('{"query" : {"bool" : { "must" : [ { "match_phrase" : {"%s": "%s" }}]}}}', field.name, validate_doc[field.name])

                    request.get(url, { body: query }, function (err, res, data) {
                        if (res.statusCode == 200) {
                            // to Object
                            data = JSON.parse(data)

                            if ((data.hits) && (data.hits.total > 0)) {
                                // se não encontro um hit com a mesma key
                                if (_.findWhere(data.hits.hits, {_id: validate_doc.key}) == null) {
                                    validate_model.validate_message.push(util.format("Outro(a) %s tem esse(a) %s cadastrado(a). Escolha outro para proceguir.", validate_model.display, field.display))
                                }
                            }
                        }
                        call_validate()
                    })

                } else {
                    call_validate()
                }

            } else if (validate_type == 'make_hash') {

                if (validate_doc[field.name] != '' && validate_doc[field.name] != null && validate_doc[field.name] != undefined) {
                    validate_doc[field.name] = security.make_hash(validate_doc[field.name]).toString('hex')
                }
                call_validate()

            }

        }, function () {
            call_field()
        })
    }, function () {
        return callback(validate_doc, validate_model)
    })
}