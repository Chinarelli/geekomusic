const { app } = require( 'electron' );
const Analytics  = require( 'electron-google-analytics' );
const analytics = new Analytics.default( 'UA-73161831-2' );
const uuid = require( 'uuid/v4' );
const electronStore = require( 'electron-store' );
const store = new electronStore();

let userId = store.get( 'uuid' );

if (userId == undefined) {
    userId = uuid();
    store.set('uuid', userId);
}

function setAnalyticsEvent(from, action, label, value) {
    analytics.event(action, from, {evLabel: label, evValue: value, clientID: userId});
}

function setAnalyticsScreen(from) {
    analytics.screen('Geeko YouTube Music', app.getVersion(), 'app.geeko', 'app.geeko', from, userId);
}

exports.setEvent = setAnalyticsEvent;
exports.setScreen = setAnalyticsScreen;