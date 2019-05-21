const {app, BrowserWindow, BrowserView, globalShortcut, Menu, ipcMain: ipc, systemPreferences} = require('electron');
const path = require('path');
const electronStore = require('electron-store');
const store = new electronStore();
const discordRPC = require('./discord-provider');
const __ = require('./translate-provider');
const paths = require('./paths.js');

global.sharedObj = {title: 'N/A', paused: true}

let icon = 'assets/favicon.png';
let mainWindowUrl = "https://music.youtube.com";
let mainWindowSize = {width: 1500, height: 800};

let songTitle;
let mainWindow;
let songAuthor;
let likeStatus;
let lastSongTitle;
let lastSongAuthor;
let rendererStatusBar;

if (process.platform == 'win32') {
    icon = 'assets/favicon.ico'
} else if (process.platform == 'darwin') {
    icon = 'assets/favicon.16x16.png'
}

function createWindow() {
    windowSize = store.get('window-size');
    windowMaximized = store.get('window-maximized');

    if (windowSize) {
        mainWindowSize.width = windowSize.width;
        mainWindowSize.height = windowSize.height;
    }

    mainWindow = new BrowserWindow({
        icon: icon,
        width: mainWindowSize.width,
        height: mainWindowSize.height,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#232323',
        show: true,
        frame: false,
        titleBarStyle: 'hidden',
        fullscreenable: (process.platform === 'darwin' ? false : true),
        webPreferences: {
            nodeIntegration: true
        }
    });

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.setBrowserView(view);

    setWindowSize(view, mainWindowSize.width, mainWindowSize.height);

    mainWindow.loadFile(paths.get("index"));

    view.webContents.loadURL(mainWindowUrl);
    mediaControl.createThumbar(mainWindow, 'play', likeStatus);

    if (windowMaximized) {
        setTimeout(function() {
            mainWindow.send('window-is-maximized', true);
            setWindowSize(view, mainWindowSize.width, mainWindowSize.height);
            mainWindow.maximize();
        }, 100);
    } else {
        let position = store.get('window-position');
        if (position != undefined) {
            mainWindow.setPosition(position.x, position.y);
        }
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.on('show', function () {
        mediaControl.createThumbar(mainWindow, 'play', likeStatus);
    });

    view.webContents.on('did-navigate-in-page', function() {
        store.set('window-url', view.webContents.getURL());
        view.webContents.insertCSS(`
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #232323;
            }

            ::-webkit-scrollbar-thumb {
                background: #f44336;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `);
    });

    view.webContents.on('media-started-playing', function () {
        if (process.platform === 'darwin') {
            global.sharedObj.paused = false;
            rendererStatusBar.send('update-status-bar');
        }

        view.webContents.executeJavaScript(`document.getElementsByClassName('title ytmusic-player-bar')[0].innerText`, null, function(title) {
            songTitle = title;

            view.webContents.executeJavaScript(`document.getElementById('like-button-renderer').getAttribute('like-status')`, null, function(data) {
                likeStatus = data;
                mediaControl.createThumbar(mainWindow, 'pause', likeStatus);
            });

            setTimeout(function() {
                view.webContents.executeJavaScript(`
                    var bar = document.getElementsByClassName('subtitle ytmusic-player-bar')[0];
                    var title = bar.getElementsByClassName('yt-simple-endpoint yt-formatted-string');
                    if (!title.length) {title = bar.getElementsByClassName('byline ytmusic-player-bar')}
                    title[0].innerText
                `, null, function (author) {
                    songAuthor = author;

                    if (songTitle !== undefined && songAuthor !== undefined) {
                        if (lastSongTitle !== songTitle || lastSongAuthor !== songAuthor) {
                            lastSongTitle = songTitle;
                            lastSongAuthor = songAuthor;

                            updateActivity(songTitle, songAuthor);
                        }
                    }
                });
            }, 500);
        });
    });

    view.webContents.on('media-paused', function () {
        try {
            if (process.platform === 'darwin') {
                global.sharedObj.paused = true;
                rendererStatusBar.send('update-status-bar');
            }
            
            mediaControl.createThumbar(mainWindow, 'play', likeStatus);
        } catch {

        }
    });

    mainWindow.on('resize', function() {
        const windowSize = mainWindow.getSize();

        setWindowSize(view, windowSize[0], windowSize[1]);

        mainWindow.send('window-is-maximized', mainWindow.isMaximized());

        store.set('window-maximized', mainWindow.isMaximized());
        if (!mainWindow.isMaximized()) {
            store.set('window-size', {width: windowSize[0], height: windowSize[1]});
        }
    });

    mainWindow.on('move', function() {
        let position = mainWindow.getPosition();
        store.set('window-position', {x: position[0], y: position[1]});
    });

    mainWindow.on('close', function(e) {
        if (process.platform === 'darwin') {
            app.quit();
            return;
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    globalShortcut.register('MediaPlayPause', function() {
        mediaControl.playPauseTrack(view);
    });

    globalShortcut.register('MediaStop', function() {
        mediaControl.stopTrack(view);
    });

    globalShortcut.register('MediaPreviousTrack', function() {
        mediaControl.previousTrack(view);
    });

    globalShortcut.register('MediaNextTrack', function() {
        mediaControl.nextTrack(view)
    });

    globalShortcut.register('CmdOrCtrl+Shift+Space', function() {
        mediaControl.playPauseTrack(view);
    });
    
    globalShortcut.register('CmdOrCtrl+Shift+B', function() {
        mediaControl.stopTrack(view);
    });

    globalShortcut.register('CmdOrCtrl+Shift+,', function() {
        mediaControl.previousTrack(view);
    });

    globalShortcut.register('CmdOrCtrl+Shift+.', function() {
        mediaControl.nextTrack(view)
    });

    ipc.on('what-is-song-playing-now', function(e, data) {
        e.sender.send('song-playing-now-is', {author: songAuthor, title: songTitle})
    })

    ipc.on('media-play-pause', () => {mediaControl.playPauseTrack(view)});
    ipc.on('media-next-track', () => {mediaControl.nextTrack(view)});
    ipc.on('media-previous-track', () => {mediaControl.previousTrack(view)});
    
    ipc.on ('register-renderer', (event, arg) => {
        rendererStatusBar = event.sender;
        event.sender.send('update-status-bar');
    });

    ipc.on ('update-tray', () => {
        if (process.platform === "darwin") {
            rendererStatusBar.send('update-status-bar')
            // tray.setShinyTray();
        }
    });

    function updateActivity(songTitle, songAuthor) {
        let nowPlaying = songTitle + ' - ' + songAuthor;

        if (process.platform === 'darwin') {
            global.sharedObj.title = nowPlaying;
            rendererStatusBar.send('update-status-bar');
        }

        mainWindow.setTitle(nowPlaying);
        discordRPC.activity(songTitle, songAuthor);
    }
}

app.on('ready', function() {
    createWindow();
    menuBar();

    store.set('app-dark', systemPreferences.isDarkMode());
    store.set('app-language', app.getLocale());

    if (process.platform === 'darwin') {
        tray.createTray(mainWindow, icon);

        ipc.on ('updated-tray-image', function(event, payload) {
            tray.updateImage(payload);
        });
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }else{
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }    
});

function setWindowSize(view, width, height) {
    if (process.platform == 'darwin') {
        view.setBounds({x: 0, y: 22, width: width, height: height - 20});
    } else {
        view.setBounds({x: 0, y: 30, width: width, height: height - 50});
    }
}

function menuBar () {
    var menu = Menu.buildFromTemplate([
        {
            label: "Geeko",
            submenu: [
                {label: __.trans('LABEL_ABOUT'), role: 'about'},
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
    ]);

    Menu.setApplicationMenu(process.platform === 'darwin' ? menu : null); 
}

const mediaControl = require('./media-provider');
const tray = require('./tray');
const analytics = require('./analytics-provider');

analytics.setEvent('main', 'start', 'v' + app.getVersion(), app.getVersion());
analytics.setEvent('main', 'os', process.platform, process.platform);
analytics.setScreen('main');