const path = require('path');

function getArchive (name) {
    if (process.platform == 'darwin') {
        return mac[name];
    } else {
        return win[name];
    }
}

const win = {
    "index": (path.join(__dirname, 'windows/index-win.html')),
    "lyrics": (path.join(__dirname, 'windows/lyrics-win.html')),
    "menu": (path.join(__dirname, 'windows/menu-win.html')),
}

const mac = {
    "index": (path.join(__dirname, 'mac/index-mac.html')),
    "lyrics": (path.join(__dirname, 'mac/lyrics-mac.html')),
    "menu": (path.join(__dirname, 'mac/menu-mac.html')),
}

exports.get = getArchive;