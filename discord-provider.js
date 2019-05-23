const DiscordRPC = require('discord-rpc');
const startTimestamp = new Date();
const clientId = '575444374268149763';

let rpc = new DiscordRPC.Client({transport: 'ipc'});

DiscordRPC.register(clientId);

function setActivity(songTitle, songAuthor) {
  if (!rpc) {
    return;
  }

  rpc.login({clientId}).then(
    function() {
      rpc.setActivity({
        details: songTitle,
        state: songAuthor,
        startTimestamp,
        largeImageKey: 'geeko_logo_512',
        instance: false,
      });
    }, function() {
      setTimeout(function() {
        rpc = new DiscordRPC.Client({transport: 'ipc'});
        setActivity(songTitle, songAuthor);
      }, 10000);
    }
  )
}

exports.activity = setActivity;