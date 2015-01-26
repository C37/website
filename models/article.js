/**
 * Module dependencies
 */
var model = require('../library/model'),
    db = require("../library/database");

exports.Article = function () {
    article.prototype = model.Base;
    return new article();
}

function article() {
    this._id = db.keyCreate();
    this.type = 'article';
    this.display = 'Artigo';
    this.db = db.Site;
    this.version = true;
    this.fields = [
        {
            name: 'name',
            display: 'Nome do artigo',
            validate: ['required', 'unique'],
            value: ''
        },
        {
            name: 'type',
            display: 'Tipo',
            validate: ['required'],
            value: ''
        },
        {
            name: 'category',
            display: 'Categoria',
            validate: ['required'],
            value: ''
        },
        {
            name: 'tags',
            display: 'Tags',
            validate: ['required'],
            value: ''
        },
        {
            name: 'content',
            display: 'Conteúdo',
            validate: ['required'],
            value: ''
        },
        {
            name: 'member',
            display: '',
            validate: ['make_user'],
            value: ''
        },
        {
            name: 'created',
            display: '',
            validate: ['make_now'],
            value: ''
        }
    ];
    this.relationships = [];
    this.validate_message = [];
}