const i18n = require( 'i18n' );
const electronStore = require('electron-store');
const store = new electronStore();
const defaultLocale = store.get( 'app-language', 'en' ) == 'pt' || store.get( 'app-language', 'en' ) == 'pt-BR' || store.get( 'app-language', 'en' ) == 'pt-PT' ? 'pt' : 'en'

i18n.configure( {
    locales: [ 'en', 'pt' ],
    directory: __dirname + '/locales',
    defaultLocale: defaultLocale
} );

exports.setLocale = function( locale ) {
    i18n.setLocale( locale );
}

exports.trans = function( id ) {
    return i18n.__( id );
}