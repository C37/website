/**
 * Module dependencies
 */
var model = require('../library/model'),
    db = require("../library/database");

exports.Member = function () {
    member.prototype = model.Base;
    return new member();
}

function member() {
    this._id = db.keyCreate();
    this.type = 'member';
    this.display = 'Usuário';
    this.db = db.User;
    this.version = false;
    this.fields = [
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
            validate: ['make_now'],
            value: ''
        }
    ];
    this.relationships = [];
    this.validate_message = [];
}

exports.Signin = function () {
    signin.prototype = model.Base;
    return new signin();
}

function signin() {
    this.type = 'member';
    this.db = db.User;
    this.fields = [
        {
            name: 'name_user',
            display: 'Nome de usuário',
            validate: ['required'],
            value: ''
        },
        {
            name: 'password',
            display: 'Sua senha',
            validate: ['required'],
            value: ''
        }
    ];
    this.validate_message = [];
}

