var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!' && message.length > 1) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var val = args[1];
       
        args = args.splice(1);
        switch(cmd) {
            case 'add':
                if (val.includes('https://www.youtube.com/watch?v=')) {
                    fs.readFile('stored-music.json', 'utf-8', function readFileCallback(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var obj = JSON.parse(data);
                            obj.music.push({link: val});
                            var json = JSON.stringify(obj, null, 4);
                            fs.writeFile('stored-music.json', json, 'utf-8', (e) => {});
                        }
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: "Invalid URL"
                    })
                }
            break;
            case 'play':
                var voiceChannelID = bot.servers[bot.channels[channelID].guild_id].members[userID].voice_channel_id
                bot.joinVoiceChannel(voiceChannelID);
            break;
            case 'leave':
                bot.disconnect()
            break;
         }
     }
});