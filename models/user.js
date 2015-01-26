/**
 * Module dependencies
 */
var model = require('../library/model'),
    data_index = require("../library/data_index")

exports.Member = function () {
    member.prototype = model.Base
    return new member()
}

function member() {
    this.type = 'member'
    this.display = 'Usuário'
    this.data_index = data_index.user
    this.version = true
    this.fields = [
        {
            name: 'key',
            validate: ['required'],
            value: ''
        },
        {
            name: 'name_user',
            display: 'Nome de usuário',
            validate: ['required', 'unique'],
            value: ''
        },
        {
            name: 'name_complete',
            display: 'Nome completo',
            validate: ['required'],
            value: ''
        },
        {
            name: 'birth_day',
            display: 'Dia do nascimento',
            validate: ['required'],
            value: ''
        },
        {
            name: 'birth_mounth',
            display: 'Mês do nascimento',
            validate: ['required'],
            value: ''
        },
        {
            name: 'birth_year',
            display: 'Ano do nascimento',
            validate: ['required'],
            value: ''
        },
        {
            name: 'gender',
            display: 'Sexo',
            validate: ['required'],
            value: 'Feminino'
        },
        {
            name: 'location',
            display: 'Cidade - Estado',
            validate: ['required'],
            value: ''
        },
        {
            name: 'expertise_area',
            display: 'Área de atuação',
            validate: ['required'],
            value: ''
        },
        {
            name: 'email',
            display: 'Email',
            validate: ['required', 'unique'],
            value: ''
        },
        {
            name: 'password',
            display: 'Sua senha',
            validate: ['required', 'make_hash'],
            value: ''
        },
        {
            name: 'created',
            display: '',
            validate: ['required'],
            value: ''
        }
    ]
    this.relationships = []
    this.validate_message = []
}

exports.Signin = function () {
    signin.prototype = model.Base
    return new signin()
}

function signin() {
    this.type = 'member'
    this.data_index = data_index.user
    this.fields = [
        {
            name: 'name_user_email',
            display: 'Nome de usuário ou Email',
            validate: ['required'],
            value: ''
        },
        {
            name: 'password',
            display: 'Sua senha',
            validate: ['required'],
            value: ''
        }
    ]
    this.validate_message = []
}

