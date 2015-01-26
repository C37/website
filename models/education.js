/**
 * Module dependencies
 */
var model = require('../library/model'),
    data_index = require("../library/data_index")

exports.Category = function () {
    category.prototype = model.Base
    return new category()
}

function category() {
    this.type = 'category'
    this.display = 'Categoria'
    this.data_index = data_index.site
    this.fields = [
        {
            name: 'key',
            validate: ['required'],
            value: ''
        },
        {
            name: 'section',
            display: 'Seção',
            validate: ['required'],
            value: ''
        },
        {
            name: 'order',
            display: 'Ordem',
            validate: ['required', 'unique'],
            value: ''
        },
        {
            name: 'name',
            display: 'Nome da Categoria',
            validate: ['required', 'unique'],
            value: ''
        },
        {
            name: 'category_group',
            display: 'Grupo de Categoria',
            validate: [],
            value: ''
        },
        {
            name: 'created',
            display: '',
            validate: ['required'],
            value: ''
        },
        {
            name: 'user',
            display: '',
            validate: ['required'],
            value: ''
        }

    ]
    this.field_order = 'name';
    this.relationships = ['category']
    this.validate_message = []
}

exports.Article = function () {
    article.prototype = model.Base
    return new article()
}

function article() {
    this.type = 'article'
    this.display = 'Artigo'
    this.data_index = data_index.site
    this.version = true
    this.fields = [
        {
            name: 'key',
            validate: ['required'],
            value: ''
        },
        {
            name: 'name',
            display: 'Nome do artigo',
            validate: ['required', 'unique'],
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
            name: 'created',
            display: '',
            validate: ['required'],
            value: ''
        },
        {
            name: 'user',
            display: '',
            validate: ['required'],
            value: ''
        }
    ]
    this.field_order = 'created';
    this.relationships = ['category']
    this.validate_message = []
}