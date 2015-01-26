
/**
 * Module dependencies
 */
var context = require("../library/context"),
    model = require("../models/education"),
    _ = require("underscore"),
    markdown = require( "markdown" ).markdown

/**
 * Module exports
 */
module.exports = function(app) {

    /*
     * For education = overview
     */
    app.get('/ensino', function(req, res) {
        return res.render(req.originalUrl == '/ensino/' ? 'error/404' : 'education/overview', { context: context.get(req) })
    })

    /*
     * For categories by :section
     */
    app.get('/ensino/:section', function(req, res) {

        if (req.param('section') &&
           (req.param('section').toLowerCase() == 'meu-proprio-negocio' ||
            req.param('section').toLowerCase() == 'tecnologia' ||
            req.param('section').toLowerCase() == 'ferramentas-cax')) {

            var section = ''
            switch (req.param('section')) {
                case 'meu-proprio-negocio' : {
                    section = 'my-business'
                    break
                }
                case 'tecnologia' : {
                    section = 'technology'
                    break
                }
                case 'ferramentas-cax' : {
                    section = 'cax-tool'
                    break
                }
                default : break
            }

            model.Category().find({ section: section }, function(categories) {

                // for order to user view
                if (categories) {
                    categories = _.sortBy(categories, function(category) { return category.order })
                }

                return res.render('education/' + section, {
                    context: context.get(req),
                    section: req.param('section'),
                    categories: categories
                })

            })
        } else {
            return res.render('error/404', { context: context.get(req) })
        }
    })

    /*
     * For articles by :category
     */
    app.get('/ensino/:section/:category', function(req, res) {

        // validando as sections
        if ((req.param('section') && req.param('category')) &&
           (req.param('section').toLowerCase() == 'meu-proprio-negocio' ||
            req.param('section').toLowerCase() == 'tecnologia' ||
            req.param('section').toLowerCase() == 'ferramentas-cax')) {

            var section = ''
            switch (req.param('section')) {
                case 'meu-proprio-negocio' : {
                    section = 'my-business'
                    break
                }
                case 'tecnologia' : {
                    section = 'technology'
                    break
                }
                case 'ferramentas-cax' : {
                    section = 'cax-tool'
                    break
                }
                default : break
            }

            model.Category().find({ section: section }, function(categories) {

                // for order to user view
                if (categories) {
                    categories = _.sortBy(categories, function(category) { return category.order })
                }

                // parse category
                var category_name = req.param('category').split('-').join(' ')
                // find category
                model.Category().find({ name: category_name }, function(category) {

                    if (category[0]) {

                        model.Article().find({ category: category[0].key }, function(articles) {

                            articles.forEach(function(article) {
                                article.content = markdown.toHTML(article.content)
                            })

                            return res.render('education/article-list', {
                                context: context.get(req),
                                section: req.param('section'),
                                categories: categories,
                                articles: articles
                            })

                        })

                    } else {
                        return res.render('error/404', { context: context.get(req) })
                    }

                })

            })

        } else {
            return res.render('error/404', { context: context.get(req) })
        }
    })

    /*
     * For article by :article
     */
    app.get('/ensino/:section/:category/:article', function(req, res) {

        // validando as sections
        if ((req.param('section') && req.param('category') && (req.param('article'))) &&
           (req.param('section').toLowerCase() == 'meu-proprio-negocio' ||
            req.param('section').toLowerCase() == 'tecnologia' ||
            req.param('section').toLowerCase() == 'ferramentas-cax')) {

            var section = ''
            switch (req.param('section')) {
                case 'meu-proprio-negocio' : {
                    section = 'my-business'
                    break
                }
                case 'tecnologia' : {
                    section = 'technology'
                    break
                }
                case 'ferramentas-cax' : {
                    section = 'cax-tool'
                    break
                }
                default : break
            }

            model.Category().find({ section: section }, function(categories) {

                // for order to user view
                if (categories) {
                    categories = _.sortBy(categories, function(category) { return category.order })
                }

                // parse category
                var category_name = req.param('category').split('-').join(' ')

                // find category
                model.Category().find({ name: category_name }, function(category) {

                    if (category[0]) {

                        // parse article
                        var article_name = req.param('article').split('-').join(' ')

                        // find article
                        model.Article().find({ name: article_name }, function(article) {

                            if (article[0]) {

                                // markdown to html in the content field
                                article[0].content = markdown.toHTML(article[0].content);

                                return res.render('education/article-view', {
                                    context: context.get(req),
                                    section: req.param('section'),
                                    categories: categories,
                                    article: article[0]
                                })
                            } else {
                                return res.render('error/404', { context: context.get(req) })
                            }

                        })

                    } else {
                        return res.render('error/404', { context: context.get(req) })
                    }

                })

            })

        } else {
            return res.render('error/404', { context: context.get(req) })
        }
    })

}