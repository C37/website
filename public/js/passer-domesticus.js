/**
 * Created with JetBrains WebStorm.
 * User: lilo
 * Date: 5/2/13
 * Time: 11:31 AM
 * To change this template use File | Settings | File Templates.
 */
(function( window, document ) {
    'use strict';

    var head = document.head || document.getElementsByTagName('head')[0];
    var storagePrefix = 'c37-';
    var defaultExpiration = 5000;

    var wrapjsData = function( data ) {
        var obj = new Object(), now = +new Date();

        obj.data = data;
        obj.stamp = now;
        obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );

        return obj;
    };

    var addLocalStorage = function( key, jsFile ) {
        try {
            localStorage.setItem( storagePrefix + key, JSON.stringify( jsFile ) );
            return true;
        } catch( e ) {
            if ( e.name.toUpperCase().indexOf('QUOTA') >= 0 ) {
                var item;
                var tempScripts = [];

                for ( item in localStorage ) {
                    if ( item.indexOf( storagePrefix ) === 0 ) {
                        tempScripts.push( JSON.parse( localStorage[ item ] ) );
                    }
                }

                if ( tempScripts.length ) {
                    tempScripts.sort(function( a, b ) {
                        return a.stamp - b.stamp;
                    });

                    passer.remove( tempScripts[ 0 ].key );

                    return addLocalStorage( key, jsFile );

                } else {
                    // no files to remove. Larger than available quota
                    return;
                }

            } else {
                // some other error
                return;
            }
        }

    };

    var injectScript = function( jsFile ) {
        var script = document.createElement('script');
        script.defer = true;
        // Have to use .text, since we support IE8,
        // which won't allow appending to a script
        script.text = jsFile.data;
        head.appendChild( script );
    };

    var getServerjsFile = function( url ) {
        var xhr = new XMLHttpRequest();

        xhr.open( "GET", url, false );
        xhr.send(null);

        if( xhr.status === 200 ) {
            return xhr.responseText;
        } else {
            return new Error( xhr.statusText )
        }
    };

    var getLocaljsFile = function( key ) {
        var item = localStorage.getItem( storagePrefix + key );
        try	{
            return JSON.parse( item || 'false' );
        } catch( e ) {
            return false;
        }
    };

    var remove = function( key ) {
        localStorage.removeItem( storagePrefix + key );
        return this;
    };

    window.passer = {
        mount: function(resources) {
            try {
                for (var i=0; i<= resources.length-1; i++) {
                    var jsStorage = getLocaljsFile(resources[i].url);
                    if (jsStorage) {
                        injectScript(jsStorage);
                    } else {
                        var jsContent = getServerjsFile(resources[i].url);
                        var jsStorage = wrapjsData(jsContent);

                        injectScript(jsStorage);
                        addLocalStorage(resources[i].url, jsStorage);
                    }
                }
            } catch ( e ) {
                return false;
            }
        },

        clear: function( expired ) {
            var item, key;
            var now = +new Date();

            for ( item in localStorage ) {
                key = item.split( storagePrefix )[ 1 ];
                if ( key && ( !expired || getLocaljsFile( key ).expire <= now ) ) {
                    remove( key );
                }
            }

            return this;
        }
    };

    // delete expired keys
    passer.clear( true );

})( this, document );
