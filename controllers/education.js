
/**
 * Module dependencies
 */
var context = require("../library/context"),
    model = require("../models/article"),
    markdown = require( "markdown" ).markdown;

/**
 * Module exports
 */
module.exports = function(app) {

    /**
     * Public methods
     */
    app.get('/education', function(req, res) {
        return res.render('education/overview', { context: context.get(req) });
    });

    app.get('/education/my-business', function(req, res) {
        model.Article().pagination(1, function(docs) {

            docs_html = [];
            docs.forEach(function(doc) {
                doc.content = markdown.toHTML(doc.content);
                docs_html.push(doc);
            });

            return res.render('education/my-business', { context: context.get(req), docs: docs_html });
        })
    });

    app.get('/education/my-business/article-new', function(req, res) {
        if (context.get(req).member) {

            var categories = ['Administração', 'Financeiro', 'Contabilidade', 'Marketing', 'Propaganda', 'Produção'];

            model.Article().create(function(doc) {
                return res.render('education/article-new', { article_type: 'my-business', article_categories: categories, context: context.get(req), doc: doc });
            })

        } else {
            return res.redirect('/signin');
        }
    });

    app.post('/education/my-business/article-new', function(req, res) {

        model.Article().save(req.body, context.get(req), function(validated_doc, validated_model) {
            if (validated_model) {

                var categories = ['Administração', 'Financeiro', 'Contabilidade', 'Marketing', 'Propaganda', 'Produção'];

                return res.render('education/article-new', { article_type: 'my-business', article_categories: categories, context: context.get(req), doc: validated_model });

            } else {
                return res.redirect('/education/my-business');
            }
        });

    });

    app.get('/education/technology', function(req, res) {
        return res.render('education/technology', { context: context.get(req) });
    });

    app.get('/education/cax-tool', function(req, res) {
        return res.render('education/cax-tool', { context: context.get(req) });
    });
}