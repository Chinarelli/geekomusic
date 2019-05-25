const {app} = require('electron');
const path = require('path');
const __ = require('./provider-translate');
const mediaControl = require('./media-control');

function thumbar (window, type, status) {
    let thumbsUp = 'assets/img/controls/thumbs-up-button-outline.png';
    let thumbsDown = 'assets/img/controls/thumbs-down-button-outline.png';
    let thumbsReverse = '';

    switch(status) {
        case 'LIKE':
            thumbsUp = 'assets/img/controls/thumbs-up-button.png';
            thumbsDown = 'assets/img/controls/thumbs-down-button-outline.png';
            thumbsReverse = 'INDIFFERENT';
            break;
        
        case 'DISLIKE':
            thumbsUp = 'assets/img/controls/thumbs-up-button-outline.png';
            thumbsDown = 'assets/img/controls/thumbs-down-button.png';
            thumbsReverse = 'INDIFFERENT';
            break;

        case 'INDIFFERENT':
            thumbsUp = 'assets/img/controls/thumbs-up-button-outline.png';
            thumbsDown = 'assets/img/controls/thumbs-down-button-outline.png';
            thumbsReverse = (status == 'LIKE') ? 'DISLIKE' : 'LIKE';
            break;
    }

    playOrPause = {
        tooltip: __.trans('MEDIA_CONTROL_PLAY'),
        icon: path.join(__dirname, 'assets/img/controls/play-button.png'),
        click: function() {
            mediaControl.mediaPlayPauseTrack(window.getBrowserView()); 
        }
    }

    if (type !== 'play') {
        playOrPause.tooltip = __.trans('MEDIA_CONTROL_PAUSE');
        playOrPause.icon = path.join(__dirname, 'assets/img/controls/pause-button.png');
    }

    return [
        {
            tooltip: __.trans('MEDIA_CONTROL_THUMBS_DOWN'),
            icon: path.join(__dirname, thumbsDown),
            click: function() {
                mediaControl.mediaDownVote(window.getBrowserView(), thumbar(window, type, thumbsReverse)); 
            }
        },
        {
            icon: path.join(__dirname, 'assets/img/null.png'),
            flags: [ 'disabled', 'nobackground' ]
        },
        {
            tooltip: __.trans('MEDIA_CONTROL_PREVIOUS'),
            icon: path.join(__dirname, 'assets/img/controls/play-previous-button.png'),
            click: function() {
                mediaControl.mediaPreviousTrack(window.getBrowserView()); 
            }
        },
        {
            tooltip: playOrPause.tooltip,
            icon: playOrPause.icon,
            click: function() {
                mediaControl.mediaPlayPauseTrack(window.getBrowserView()); 
            }
        },
        {
            tooltip: __.trans('MEDIA_CONTROL_NEXT'),
            icon: path.join(__dirname, 'assets/img/controls/play-next-button.png'),
            click: function() {
                mediaControl.mediaNextTrack(window.getBrowserView());
            }
        },
        {
            icon: path.join(__dirname, 'assets/img/null.png'),
            flags: [ 'disabled', 'nobackground' ]
        },
        {
            tooltip: __.trans('MEDIA_CONTROL_THUMBS_UP'),
            icon: path.join(__dirname, thumbsUp),
            click: function() {
                mediaControl.mediaUpVote(window.getBrowserView(), thumbar(window, type, thumbsReverse));
            }
        }
    ];
}

function context (window) {
    return [
        { 
          label: __.trans('MEDIA_CONTROL_PLAY_PAUSE'), 
          type: 'normal', 
          click: function() {
            mediaControl.playPauseTrack(window.getBrowserView()) 
          }
        },
        { type: 'separator' },
        {
          label: __.trans('MEDIA_CONTROL_PREVIOUS'), 
          type: 'normal', 
          click: function() { 
            mediaControl.previousTrack(window.getBrowserView()) 
          }
        },
        { 
          label: __.trans('MEDIA_CONTROL_NEXT'), 
          type: 'normal', 
          click: function() { 
            mediaControl.nextTrack(window.getBrowserView()) 
          } 
        },
        { type: 'separator' },
        { 
          label: __.trans('MEDIA_CONTROL_THUMBS_UP'), 
          type: 'normal', 
          click: function() { 
            mediaControl.upVote(window.getBrowserView()) 
          } 
        },
        { 
          label: __.trans('MEDIA_CONTROL_THUMBS_DOWN'), 
          type: 'normal', 
          click: function() { 
            mediaControl.downVote(window.getBrowserView()) 
          } 
        },
        { type: 'separator' },
        { 
          label: __.trans('LABEL_EXIT'), 
          type: 'normal', 
          click: function() { 
            app.exit(); 
          }
        }
    ];
}

function menu () {
    return [
        {
            label: "Geeko",
            submenu: [
                {label: __.trans('LABEL_ABOUT'),
                    click () { 
                        require('electron').shell.openExternal('https://github.com/xxgicoxx/geekomusic');
                    }
                },
                {type: 'separator'},
                {label: __.trans('LABEL_EXIT'), role: 'quit'}
            ]
        },
        {
            label: __.trans('LABEL_EDIT'),
            submenu: [
              {label: __.trans('LABEL_UNDO'), role: 'undo'},
              {label: __.trans('LABEL_REDO'), role: 'redo'},
              {type: 'separator'},
              {label: __.trans('LABEL_CUT'), role: 'cut'},
              {label: __.trans('LABEL_COPY'), role: 'copy'},
              {label: __.trans('LABEL_PASTE'), role: 'paste'}
            ]
        },
        {
            label: __.trans('LABEL_VIEW'),
            submenu: [
                {label: __.trans('LABEL_RELOAD'), role: 'reload'},
                {label: __.trans('LABEL_FORCE_RELOAD'), role: 'forcereload'},
            ]
        },
        {
            label: __.trans('LABEL_HELP'), role: 'help',
            submenu: [
                {
                    label: __.trans('LABEL_LEARN_MORE'),
                    click () { 
                        require('electron').shell.openExternal('https://github.com/xxgicoxx/geekomusic');
                    }
                }
            ]
        }
    ];
}

exports.thumbar = thumbar;
exports.context = context;
exports.menu = menu;