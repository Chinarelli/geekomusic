const {Menu, Tray} = require('electron');
const nativeImage = require('electron').nativeImage;
const template = require('./menu-template');

let tray = null;
let saved_mainWindow = null;

let init_tray = () => {
  const contextMenu = Menu.buildFromTemplate(template.context(saved_mainWindow));

  tray.setToolTip('Geeko YouTube Music');
  tray.setContextMenu(contextMenu);

  tray.addListener('click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.hide() : saved_mainWindow.show();
  });

  tray.addListener('balloon-click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.focus() : saved_mainWindow.show();
  });
}

exports.createTray = function(mainWindow, icon) {
    const nativeImageIcon = nativeImage.createFromPath(null);
    tray = new Tray(nativeImageIcon);
  
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
