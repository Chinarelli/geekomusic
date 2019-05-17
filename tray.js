const { app, Menu, Tray, BrowserWindow } = require( 'electron' );
const path = require( 'path' );
const mediaControl = require( './mediaProvider' );
const nativeImage = require( 'electron' ).nativeImage;
const electronStore = require('electron-store');
const store = new electronStore();
const __ = require( './translateProvider' );
const paths = require('./paths.js');

let tray = null;
let saved_icon = null;
let saved_mainWindow = null;
let popUpMenu = null;

let init_tray = () => {
  const contextMenu = Menu.buildFromTemplate(
      [
          { 
            label: 'Geeko', 
            type: 'normal', 
            click: function() { 
              saved_mainWindow.show(); 
            } 
          },
          { type: 'separator' },
          { 
            label: __.trans( 'MEDIA_CONTROL_PLAY_PAUSE' ), 
            type: 'normal', 
            click: function() {
              mediaControl.playPauseTrack(saved_mainWindow.getBrowserView()) 
            }
          },
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
            label: __.trans('LABEL_LYRICS'), type: 'normal', 
            click: function() {
              const lyrics = new BrowserWindow({ 
                icon: path.join( __dirname, 'assets/favicon.png' ),
                width: 800,
                height: 800,
                backgroundColor: '#232323',
                frame: false,
                titleBarStyle: 'hidden',
                fullscreenable: (process.platform === 'darwin' ? false : true),
                webPreferences: {
                    nodeIntegration: true
                }
              });

              lyrics.loadFile(paths.get("lyrics"));
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
    const saved_icon = path.join( __dirname, icon );
    const nativeImageIcon = nativeImage.createFromPath( saved_icon );
    tray = new Tray( nativeImageIcon );
  
    saved_mainWindow = mainWindow;
    if (process.platform != 'darwin') {
      init_tray();
    } else{
      tray.setHighlightMode('never');
      exports.setShinyTray();
    }
};

exports.quit = function() {
    tray.quit();
};

exports.setShinyTray = function(){
  if (process.platform === 'darwin'){
    tray.setContextMenu(null);
    tray.removeAllListeners();
    
    tray.on('right-click', (event, bound, position)=> {
        if (!popUpMenu.isVisible()) {
            popUpMenu.setPosition(bound.x, bound.y + bound.height + 1);
            popUpMenu.show();
        }else{
            popUpMenu.hide();
        }
    });

    tray.on('click', (event, bound, position) => {
      if (position.x < 32) {
        if(saved_mainWindow.isVisible()) {
          saved_mainWindow.hide();
        } else {
          saved_mainWindow.show();
          saved_mainWindow.focus();
        }
        // saved_mainWindow.isVisible() ?  : saved_mainWindow.show();
      }else if (position.x > 130) {
        mediaControl.playPauseTrack( saved_mainWindow.getBrowserView() );
      }
    });
    
    popUpMenu = new BrowserWindow({ 
      modal: true, 
      frame: false, 
      center: true, 
      resizable: false, 
      backgroundColor: '#232323', 
      width: 160, 
      height: 236, 
      webPreferences: {
        nodeIntegration: true
      }
    });

    popUpMenu.loadFile(paths.get("menu"));
    popUpMenu.setVisibleOnAllWorkspaces(true);
    popUpMenu.hide();
    popUpMenu.on('blur', () => {
      popUpMenu.hide();
    });
  }else{
    tray.setImage(saved_icon);
    tray.removeAllListeners();
    init_tray();
  }
}

exports.updateImage = function(payload) {
  var img = typeof nativeImage.createFromDataURL === 'function' ? nativeImage.createFromDataURL(payload) : nativeImage.createFromDataUrl(payload);
  tray.setImage(img);
}
