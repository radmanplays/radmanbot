const mineflayer = require('mineflayer');
const readline = require('readline');
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');


const options = {
    host: 'sus.shhnowisnottheti.me', //Change this to the ip you want.
    port: 25565, // Change this to the port you want.
    username: 'radmanbot',
    version: '1.20.5'
}

const bot = mineflayer.createBot(options);

bot.loadPlugin(tpsPlugin)

function welcome() {
    bot.chat('/server creative');
    bot.chat('hello, im radmanbot. a friendly bot designed for this server by radmanplays.');
    bot.chat('type !help in chat to get started');
    const viewer = mineflayerViewer(bot, { port: 3000 });
}

bot.once('spawn', welcome);

function chat(message, username) {
    if(username == "!ping"){
      if(bot.player.ping != -1){
        bot.chat("Pong! " + "UNKNOWN PING!")
      } else {
        bot.chat("Pong! " + bot.player.ping)
      }
    }
    if(username == "!tps"){
      if(bot.getTps() != -1){
        bot.chat("servertps: " + "UNKNOWN")
      } else {
        bot.chat("server tps: " + bot.getTps())
      }
    }
    if(username == "!help"){
      bot.chat("commands: !help, !tps, !ping, !stalk, !goto")
    }
    if(username == "!stalk"){
      bot.chat("you can stalk me here: https://shiny-space-funicular-74gq57w55vwfr66v-3000.app.github.dev/")
    }
    if(username == ("!goto") ){
      bot.chat("usage: !goto <x> <y> <z>")
    }
    if(username.startsWith("!goto ") ){
      var targetLength = "!goto".length;
      var message = username.toString().trim();
      if ( //If
          message.length > targetLength && //The length of the message is longer than the target length
          message.substring(0, targetLength).trim().toLowerCase() === "!goto" //And, the content from character 0 (first) to that of the length, trimmed and put to lowercase is "!goto"
        ) {
          var x = message.substring(targetLength+1);
          var y = message.substring(targetLength+3);
          var z = message.substring(targetLength+5);
          if(x & y & z){
            bot.pathfinder.setGoal(new GoalBlock(x, y, z))
            bot.chat("going to " + x + " " + y + " " + z + " ")
          }
      }
    }
    console.log(message + " > " + username);
}

bot.on('chat', chat);

function whisper(message, username) {
  console.log(message + " whispers to you: " + username);
}

bot.on('whisper', whisper);

function kicked(reason) {
  if (reason == `{"translate":"multiplayer.disconnect.kicked"}`){
    console.log("you got kicked for: " + "Kicked by an operator");
  }else{
    var jsonString = reason;
    var jsonObj = JSON.parse(jsonString);
    var text = jsonObj.text;
    var trimmedText = text.trim();

    var realreason = trimmedText;

    console.log("you got kicked for: " + realreason);
  }
  process.exit();
}

bot.on('kicked', kicked)

function error(reason) {
    console.log("error: " + reason);
}

bot.on('error', error)

function end(reason) {
  console.log(reason);
  process.exit();
}

bot.on('end', end)

function lookAtNearestPlayer () {
  const playerFilter = (entity) => entity.type === 'player'
  const playerEntity = bot.nearestEntity(playerFilter)
  
  if (!playerEntity) return
  
  const pos = playerEntity.position.offset(0, playerEntity.height, 0)
  bot.lookAt(pos)
}

bot.on('physicTick', lookAtNearestPlayer)



// Create interface for reading user input from console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true // This is necessary for ANSI escape sequences to work
});

// Listen for user input
rl.on('line', (input) => {
    if (input) {
        bot.chat(input);
        // ANSI escape sequence to move cursor up one line
        process.stdout.write('\x1B[1A');
        // ANSI escape sequence to clear current line
        process.stdout.clearLine(0);
    }
});
