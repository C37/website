

module.exports = {
    db: {
        User : {
            hosts: [
                'localhost:27017'
            ],
            username: '',
            password: '',
            database: 'user'
        },
        Site : {
            hosts: [
                'localhost:27017'
            ],
            username: '',
            password: '',
            database: 'site'
        },
        Version : {
            hosts: [
                'localhost:27017'
            ],
            username: '',
            password: '',
            database: 'version'
        },
        Logging: {
            hosts: [
                'localhost:27017'
            ],
            username: '',
            password: '',
            database: 'logging'
        }
    },
    search: {
        Logging: {
            host: 'search-001.c37.co:9200',
            index: 'logging'
        },
        User: {
            host: 'search-001.c37.co:9200',
            index: 'user'
        }
    }
}