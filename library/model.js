/**
 * Module dependencies
 */
var logging = require("./logging"),
    util = require("util"),
    async = require("async"),
    security = require("./security");

module.exports = {

    Base: {
        create: function(callback) {
            return callback(this);
        },
        load: function(key, callback) {

        },
        pagination: function(page_number, callback) {

            var model = this;

            model.db(function(err, db) {
                var collection = db.collection(model.type);

                collection.find().toArray(function(err, docs){
                    return callback(docs);
                })
            });
        },
        save: function(doc, context, callback) {

            var model = this;

            validate(doc, model, context, function(validated_doc, validated_model) {

                if (validated_model.validate_message.length <= 0) {

                    model.db(function(err, db) {
                        var collection = db.collection(model.type);
                        collection.insert(validated_doc, function(err, validated_saved) {
                            return callback(validated_doc, null);
                        })
                    })

                } else {
                    return callback(null, validated_model);
                }

            })
        },
        authenticate: function(doc, callback) {

            var model = this;

            validate(doc, model, null, function(validated_doc, validated_model) {

                if (validated_model.validate_message.length <= 0) {

                    model.db(function(err, db) {
                        var collection = db.collection(model.type);

                        collection.findOne({ name_user: validated_doc.name_user }, function(err, member) {

                            if (member) {
                                var password_hash = security.make_hash(validated_doc.password).toString('hex');

                                if (member.password == password_hash) {
                                    return callback(member, null);
                                } else {
                                    validated_model.validate_message.push("A senha informada não está correta");
                                    return callback(null, validated_model);
                                }
                            } else {
                                validated_model.validate_message.push("O usuário informado não foi encontrado");
                                return callback(null, validated_model);
                            }

                        })

                    })

                } else {
                    return callback(null, validated_model);
                }

            })
        }
    }
}


function validate(validate_doc, validate_model, context, callback) {

    // para cada field em validate_model
    async.each(validate_model.fields, function(field, call_field) {

        // preenche o valor para o retorno de validate_model para a view
        field.value = validate_doc[field.name];

        // tipos de validação para cada field
        async.each(field.validate, function(validate_type, call_validate) {

            if (validate_type == 'required') {

                if (validate_doc[field.name] === '' || validate_doc[field.name] === null || validate_doc[field.name] === undefined) {
                    validate_model.validate_message.push(util.format("O campo %s é necessário", field.display));
                }
                call_validate();

            } else if (validate_type == 'unique') {

                validate_model.db(function(err, db) {

                    var collection = db.collection(validate_model.type);
                    var query = new Object();

                    query[field.name] = validate_doc[field.name];

                    collection.findOne(query, function(err, doc) {
                        if (doc) {
                            validate_model.validate_message.push(util.format("Outro %s tem esse %s cadastrado. Escolha outro para proceguir.", validate_model.display, field.display));
                        }
                        call_validate();
                    });
                });

            } else if (validate_type == 'make_hash') {

                if (validate_doc[field.name] != '' && validate_doc[field.name] != null && validate_doc[field.name] != undefined) {
                    validate_doc[field.name] = security.make_hash(validate_doc[field.name]).toString('hex');
                }
                call_validate();

            } else if (validate_type == 'make_now') {

                validate_doc[field.name] = new Date().toISOString();
                call_validate();

            } else if (validate_type == 'make_user') {

                validate_doc[field.name] = context.member.name_user;
                call_validate();

            }

        }, function(){
            call_field();
        });
    }, function(){
        return callback(validate_doc, validate_model);
    });
}