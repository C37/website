// 2015.05.29 - melhorando algos
(function (window) {
    'use strict';


    var version = '1.0.0',
        authors = ['ciro.maciel@c37.co'];


    // https://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html
    // https://developer.mozilla.org/pt-BR/docs/IndexedDB/Usando_IndexedDB
    // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB
    // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
    // https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase


    var db = null,
        name = null,
        stores = null,
        version = null,
        keyRange = null;


    function initialize(config, callback) {
        name = config.name;
        version = config.version;
        stores = config.stores;

        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        keyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        if (config.debug) {
            indexedDB.deleteDatabase(name);
        }

        var request = indexedDB.open(name, version);

        request.onerror = function () {
            return callback(request.error)
        };
        request.onupgradeneeded = function () {
            // First time setup: create an empty object store
            for (var store in stores) {
                if (!request.result.objectStoreNames.contains(store)) {
                    request.result.createObjectStore(store);

                    var objectStore = request.result.createObjectStore(store.concat('-index'));
                    objectStore.createIndex('word', 'word', {
                        unique: false
                    });
                }
            }
        };
        request.onsuccess = function () {
            db = request.result;
            return callback(null);
        };
    }

    function release(name) {
        indexedDB.deleteDatabase(name);
    }

    function add(store, key, doc, callback) {

        var transaction = db.transaction([store, store.concat('-index')], 'readwrite'),
            storeData = transaction.objectStore(store),
            storeIndex = transaction.objectStore(store.concat('-index'));

        storeData.put(doc, key);

        for (var field in doc) {

            var fieldMapping = stores[store][field];

            if (fieldMapping && fieldMapping.index && doc[field] !== '') {

                var words = tokenize(doc[field]);
                for (var word in words) {
                    var indexKey = [key, word],
                        indexDoc = {
                            field: field,
                            word: word,
                            position: words[word]
                        };
                    storeIndex.put(indexDoc, indexKey);
                }
            }
        }

        transaction.onerror = function () {
            return callback ? callback(transaction.error) : null;
        };
        transaction.oncomplete = function () {
            return callback ? callback(null) : null;
        };
    }

    function get(store, key, callback) {

        var storeData = db.transaction(store, 'readonly').objectStore(store),
            request = storeData.get(key);

        request.onerror = function () {
            return callback(request.error);
        };
        request.onsuccess = function () {
            return callback(null, request.result);
        };
    }

    function remove(store, key, callback) {

        var stringRange = keyRange.bound([key, ''], successor([key, ''])),
            transaction = db.transaction([store, store.concat('-index')], 'readwrite'),
            storeData = transaction.objectStore(store),
            storeIndex = transaction.objectStore(store.concat('-index'));

        storeIndex.openCursor(stringRange).onsuccess = function (event) {
            var result = event.target.result,
                request = null;

            if (result) { // eliminando os dados do index
                request = storeIndex.delete(result.primaryKey);

                request.onerror = function () {
                    return console.log(request.error);
                };
                request.onsuccess = function (event) {
                    return true;
                };

                result.continue();
            } else { // por ultimo, o documento
                request = storeData.delete(key);

                request.onerror = function () {
                    return console.log(request.error);
                };
                request.onsuccess = function () {
                    return true;
                };
            }
        };

        transaction.onerror = function () {
            return callback ? callback(transaction.error) : null;
        }
        transaction.oncomplete = function () {
            return callback ? callback(null, true) : null;
        }
    }

    function list(store, callback) {

        var transaction = db.transaction([store], 'readonly'),
            storeData = transaction.objectStore(store),
            docs = [];

        storeData.openCursor().onsuccess = function (event) {
            var result = event.target.result;
            if (result) {

                docs.push(result.value);

                result.continue();
            }
        };

        transaction.onerror = function () {
            return callback(transaction.error);
        };
        transaction.oncomplete = function () {
            return callback(null, docs);
        };

    }

    function search(store, word, callback) {

        var stringRange = keyRange.bound(word, successor(word)),
            transaction = db.transaction([store, store.concat('-index')], 'readonly'),
            storeData = transaction.objectStore(store),
            storeIndex = transaction.objectStore(store.concat('-index')).index('word'),
            docs = [];

        storeIndex.openCursor(stringRange).onsuccess = function (event) {
            var result = event.target.result;
            if (result) {
                var doc = result.value;

                // add complete doc in incidents docs
                var request = storeData.get(result.primaryKey[0]);

                request.onerror = function () {
                    return console.log(request.error);
                };
                request.onsuccess = function (event) {
                    if (event.target.result) {
                        doc['doc'] = event.target.result;
                        return docs.push(doc);
                    } else {
                        return false;
                    }
                };

                result.continue();
            }
        };

        transaction.onerror = function () {
            return callback(transaction.error);
        };
        transaction.oncomplete = function () {
            return callback(null, docs);
        };

    }


    function successor(key) {
        if (typeof key === 'string') {
            var len = key.length;
            while (len > 0) {
                var head = key.substring(0, len - 1),
                    tail = key.charCodeAt(len - 1);
                if (tail !== 0xFFFF)
                    return head + String.fromCharCode(tail + 1);
                key = head;
                --len;
            }
            return [];
        }

        if (Array.isArray(key)) {
            key = key.slice(); // Operate on a copy.
            len = key.length;
            while (len > 0) {
                tail = successor(key.pop());
                if (tail !== undefined) {
                    key.push(tail);
                    return key;
                }
                --len;
            }
            return undefined;
        }
    }

    function tokenize(string) {

        string = string.toString().replace(/^\s+/, '');

        var words = string.split(/\s+/)
            .map(function (w) {
                return w.toLowerCase();
            });

        var wordCount = {};

        words.forEach(function (word, pos) {
            (wordCount[word] = wordCount[word] || []).push(pos);
        });

        return wordCount;
    }


    window.c37.library.utility.object.namespace(window, 'c37.library.database');

    window.c37.library.database = {
        manager: {
            initialize: initialize,
            release: release
        },
        operation: {
            add: add,
            get: get,
            remove: remove,
            list: list,
            search: search
        }
    };


})(window);