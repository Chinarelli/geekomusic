function mediaPlayPauseTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: ';'});
}

function mediaStopTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: ';'});
}

function mediaNextTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: 'j'});
}

function mediaPreviousTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: 'k'});
}

function mediaUpVote(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: '+'});
}

function mediaDownVote(mainWindow) {
    mainWindow.webContents.sendInputEvent({type:'keydown', keyCode: '-'});
}

exports.playPauseTrack = mediaPlayPauseTrack;
exports.stopTrack = mediaStopTrack;
exports.nextTrack = mediaNextTrack;
exports.previousTrack = mediaPreviousTrack;
exports.upVote = mediaUpVote;
exports.downVote = mediaDownVote;