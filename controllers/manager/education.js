
/**
 * Module dependencies
 */
var context = require("../../library/context"),
    model = require("../../models/education"),
    _ = require("underscore"),
    markdown = require( "markdown" ).markdown

/**
 * Module exports
 */
module.exports = function(app) {

    /*
     * For categories by :section
     */
    app.get('/manager/education/:section', function(req, res) {
        model.Category().find({ section: req.param('section') }, function(categories) {

            // for order to user view
            if (categories) {
                categories = _.sortBy(categories, function(category) { return category.order })
            }

            return res.render('manager/education/section', {
                                                                context: context.get(req),
                                                                section: req.param('section'),
                                                                categories: categories
                                                            })
        })
    })

    /*
     * For category = load | create
     */
    app.get('/manager/education/:section/category-edit/:key', function(req, res) {
        model.Category().find({ section: req.param('section') }, function(categories) {
            model.Category().load(req.param('key'), context.get(req), function(category) {

                // for order to user view
                if (categories) {
                    categories = _.sortBy(categories, function(category) { return category.order })
                }

                return res.render('manager/education/category-edit', {
                                                                        context: context.get(req),
                                                                        section: req.param('section'),
                                                                        categories: categories,
                                                                        category: category
                                                                    })
            })
        })
    })

    /*
     * For category = validate + post
     */
    app.post('/manager/education/:section/category-edit/:key', function(req, res) {
        model.Category().save(req.body, function(validated_doc, validated_model) {
            if (validated_model) {
                model.Category().find({ section: req.param('section') }, function(categories) {

                    // for order to user view
                    if (categories) {
                        categories = _.sortBy(categories, function(category) { return category.order })
                    }

                    return res.render('manager/education/category-edit', {
                                                                            context: context.get(req),
                                                                            section: req.param('section'),
                                                                            categories: categories,
                                                                            category: validated_model
                                                                        })
                })
            } else {
                setTimeout(function(){
                    return res.redirect("/manager/education/" + req.param('section'))
                }, 1000)
            }

        })
    })

    /*
     * For category = delete
     */
    app.delete('/manager/education/:section/category-edit/:key', function(req, res) {
        model.Category().delete(req.param('key'), function(err) {
            return res.send(err)
        })
    })

    /*
     * For article find by :category
     */
    app.get('/manager/education/:section/:category', function(req, res) {
        model.Article().find({ category: req.param('category') }, function(articles) {

            articles.forEach(function(article) {
                article.content = markdown.toHTML(article.content);
            })

            return res.send(articles)
        })
    })

    /*
     * For article = load | create
     */
    app.get('/manager/education/:section/article-edit/:key', function(req, res) {
        model.Category().find({ section: req.param('section') }, function(categories) {
            model.Article().load(req.param('key'), context.get(req), function(article) {

                // for order to user view
                if (categories) {
                    categories = _.sortBy(categories, function(category) { return category.order })
                }

                return res.render('manager/education/article-edit', {
                    context: context.get(req),
                    section: req.param('section'),
                    categories: categories,
                    article: article
                })
            })
        })
    })

    /*
     * For article = validate + post
     */
    app.post('/manager/education/:section/article-edit/:key', function(req, res) {
        model.Article().save(req.body, function(validated_doc, validated_model) {
            if (validated_model) {
                model.Category().find({ section: req.param('section') }, function(categories) {
                    // for order to user view
                    if (categories) {
                        categories = _.sortBy(categories, function(category) { return category.order })
                    }

                    return res.render('manager/education/article-edit', {
                        context: context.get(req),
                        section: req.param('section'),
                        categories: categories,
                        article: validated_model
                    })
                })
            } else {
                setTimeout(function(){
                    return res.redirect("/manager/education/" + req.param('section'))
                }, 1000)
            }
        })
    })

    /*
     * For article = delete
     */
    app.delete('/manager/education/:section/article-edit/:key', function(req, res) {
        model.Article().delete(req.param('key'), function(err) {
            return res.send(err)
        })
    })
}
