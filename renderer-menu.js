const { remote, ipcRenderer: ipc } = require('electron');
const __ = require('./translate-provider');

document.getElementById('i18n_LABEL_POPUPMENU_PLAY').innerText = __.trans('MEDIA_CONTROL_PLAY_PAUSE');
document.getElementById('i18n_LABEL_POPUPMENU_NEXT').innerText = __.trans('MEDIA_CONTROL_NEXT');
document.getElementById('i18n_LABEL_POPUPMENU_PREVIOUS').innerText = __.trans('MEDIA_CONTROL_PREVIOUS');
document.getElementById('i18n_LABEL_POPUPMENU_LYRICS').innerText = __.trans('LABEL_LYRICS');
document.getElementById('i18n_LABEL_POPUPMENU_EXIT').innerText = __.trans('LABEL_EXIT');

document.getElementById('btn-play-pause').addEventListener('click', function() {
    ipc.send('media-play-pause');
});

document.getElementById('btn-exit').addEventListener('click', function() {
    remote.app.exit(0);
});

document.getElementById('btn-previous').addEventListener('click', function() {
    ipc.send('media-previous-track');
});

document.getElementById('btn-next').addEventListener('click', function() {
    ipc.send('media-next-track');
});

document.getElementById('btn-show-lyric').addEventListener('click', function() {
    ipc.send('show-lyrics')
});