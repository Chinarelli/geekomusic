const { app, Menu, Tray, BrowserWindow } = require( 'electron' );
const path = require( 'path' );
const mediaControl = require( './media-provider' );
const nativeImage = require( 'electron' ).nativeImage;
const __ = require( './translate-provider' );
const paths = require('./paths.js');

let tray = null;
let saved_mainWindow = null;

let init_tray = () => {
  const contextMenu = Menu.buildFromTemplate(
      [
          { 
            label: __.trans( 'MEDIA_CONTROL_PLAY_PAUSE' ), 
            type: 'normal', 
            click: function() {
              mediaControl.playPauseTrack(saved_mainWindow.getBrowserView()) 
            }
          },
          { type: 'separator' },
          {
            label: __.trans( 'MEDIA_CONTROL_PREVIOUS' ), 
            type: 'normal', 
            click: function() { 
              mediaControl.previousTrack(saved_mainWindow.getBrowserView()) 
            }
          },
          { 
            label: __.trans( 'MEDIA_CONTROL_NEXT' ), 
            type: 'normal', 
            click: function() { 
              mediaControl.nextTrack( saved_mainWindow.getBrowserView() ) 
            } 
          },
          { type: 'separator' },
          { 
            label: __.trans( 'MEDIA_CONTROL_THUMBS_UP' ), 
            type: 'normal', 
            click: function() { 
              mediaControl.upVote( saved_mainWindow.getBrowserView() ) 
            } 
          },
          { 
            label: __.trans( 'MEDIA_CONTROL_THUMBS_DOWN' ), 
            type: 'normal', 
            click: function() { 
              mediaControl.downVote( saved_mainWindow.getBrowserView() ) 
            } 
          },
          { type: 'separator' },
          { 
            label: __.trans( 'LABEL_EXIT' ), 
            type: 'normal', 
            click: function() { 
              app.exit(); 
            }
          }
      ]
  );

  tray.setToolTip( 'Geeko YouTube Music' );
  tray.setContextMenu( contextMenu );

  tray.addListener( 'click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.hide() : saved_mainWindow.show();
  } );

  tray.addListener( 'balloon-click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.focus() : saved_mainWindow.show();
  } );
}

exports.createTray = function( mainWindow, icon ) {
    // const saved_icon = path.join( __dirname, icon );
    // const nativeImageIcon = nativeImage.createFromPath( saved_icon );
    
    const nativeImageIcon = nativeImage.createFromPath(null);
    tray = new Tray( nativeImageIcon );
  
    saved_mainWindow = mainWindow;
    
    init_tray();
};

exports.quit = function() {
    tray.quit();
};

exports.updateImage = function(payload) {
  var img = typeof nativeImage.createFromDataURL === 'function' ? nativeImage.createFromDataURL(payload) : nativeImage.createFromDataUrl(payload);
  tray.setImage(img);
}
