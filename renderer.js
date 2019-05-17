const { remote, ipcRenderer: ipc } = require( 'electron' );
const electronStore = require( 'electron-store' );
const store = new electronStore();
const status = remote.getGlobal('sharedObj');
const icons = require('./icons_for_shiny_tray');
const customTitlebar = require('custom-electron-titlebar');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let icon_set = icons.bright;

canvas.height = 32;
canvas.width = 150;

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#232323'),
});

ipc.send('register-renderer');

ipc.on( 'update-status-bar', function (event, arg) {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.font = "14px Arial";

    if (store.get('app-dark')) {
        ctx.fillStyle = "white";
        icon_set = icons.dark;
    }else{
        ctx.fillStyle = "black";
        icon_set = icons.bright;
    }

	ctx.fillText(cutstr(status.title,14),30,21);
    ctx.drawImage(icon_set.icons,8,8,16,16);
  
    if (status.paused){
        ctx.drawImage(icon_set.play, 135, 6, 20,20);
    }else{
        ctx.drawImage(icon_set.pause, 135, 6, 20,20);
    }
    
    ipc.send('updated-tray-image', canvas.toDataURL('image/png', 1));
});

function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    if (str_length < len) {
        return str;
    }
}
