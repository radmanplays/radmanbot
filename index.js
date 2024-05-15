const mineflayer = require('mineflayer');
const readline = require('readline');
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalBlock } = require('mineflayer-pathfinder').goals;

let isLookingAtPlayer = false;
let isMoving = false;

const options = {
    host: 'sus.shhnowisnottheti.me', //Change this to the ip you want.
    port: 25565, // Change this to the port you want.
    username: 'radmanbot',
    version: '1.20.5'
}

const bot = mineflayer.createBot(options);

bot.loadPlugin(tpsPlugin)
bot.loadPlugin(pathfinder);

function welcome() {
    bot.chat('/server creative');
    const viewer = mineflayerViewer(bot, { port: 3000 });
    const viewer2 = mineflayerViewer(bot, { port: 3001, firstPerson: true });
    bot.chat('hello, im radmanbot. a friendly bot designed for this server by radmanplays.');
    bot.chat('type !help in chat to get started');
}

bot.once('spawn', welcome);

function chat(message, username) {
    if (message == "Discord"){
      var username = username.split('» ')[1];
    }
    console.log(message + " > " + username);
    if(username == "!ping"){
      if(bot.player.ping != -1){
        bot.chat("Pong! " + "0")
      } else {
        bot.chat("Pong! " + bot.player.ping)
      }
    }
    if(username == "!tps"){
      if(bot.getTps() != -1){
        bot.chat("servertps: " + "20")
      } else {
        bot.chat("server tps: " + bot.getTps())
      }
    }
    if (username === "!help") {
        bot.chat("commands: !help, !tps, !ping, !stalk, !goto, !stopgoingto, !look, !stoplook");
    }
    if(username == "!stalk"){
      bot.chat("you can stalk me here: https://shiny-space-funicular-74gq57w55vwfr66v-3000.app.github.dev/")
      bot.chat("first person: https://shiny-space-funicular-74gq57w55vwfr66v-3001.app.github.dev/")
    }
    if(username == ("!goto") ){
      bot.chat("usage: !goto <x> <y> <z>")
    }
    if (username.startsWith("!goto ")) {
      const coordinates = username.substring("!goto ".length).split(' ').map(coord => parseFloat(coord));
      if (coordinates.length === 3 && coordinates.every(coord => !isNaN(coord))) {
          const [x, y, z] = coordinates;
          bot.chat(`Going to ${x}, ${y}, ${z}`);
          bot.pathfinder.setGoal(new GoalBlock(x, y, z));
          isMoving = true;
      } else {
          bot.chat("Invalid coordinates. Usage: !goto <x> <y> <z>");
      }
  }
  if (username === "!stopgoingto") {
    if (isMoving) {
        bot.pathfinder.stop(); // Stop the bot from moving
        bot.chat("Stopped moving.");
        isMoving = false; // Set isMoving to false after stopping
    } else {
        bot.chat("Bot is not currently moving.");
    }
  }
  if (username === "!look") {
    startLookAtPlayer();
    bot.chat("Started looking at nearest player.");
  } else if (username === "!stoplook") {
      stopLookAtPlayer();
      bot.chat("Stopped looking at nearest player.");
  }
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

function startLookAtPlayer() {
  isLookingAtPlayer = true;
}

function stopLookAtPlayer() {
  isLookingAtPlayer = false;
}

function lookAtNearestPlayer() {
  if (isLookingAtPlayer) {
      const playerFilter = (entity) => entity.type === 'player';
      const playerEntity = bot.nearestEntity(playerFilter);

      if (playerEntity) {
          const pos = playerEntity.position.offset(0, playerEntity.height, 0);
          bot.lookAt(pos);
      }
  }
}

// Call lookAtNearestPlayer in your bot's main loop or wherever appropriate
bot.on('physicTick', lookAtNearestPlayer);



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