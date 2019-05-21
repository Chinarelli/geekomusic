const path = require('path');

function getArchive (name) {
    if (process.platform == 'darwin') {
        return mac[name];
    } else {
        return win[name];
    }
}

const win = {
    "index": (path.join(__dirname, 'windows/index-win.html'))
}

const mac = {
    "index": (path.join(__dirname, 'mac/index-mac.html'))
}

exports.get = getArchive;