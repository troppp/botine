const fs = require("fs");

require("dotenv").config();
const config = JSON.parse(fs.readFileSync('./config.json'))

const Discord = require("discord.js");
const { Client } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES"] });

process.on("unhandledRejection", (error) => {
  console.log(error);
  console.log("phil or nick moment");
  global.lasterr = newDateTime() + " - " + error;
});

// completely stolen from https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/a-basic-command-handler.md
// just letting you know
client.config = config;
client.commands = new Discord.Collection();

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./commands/${file}`);

  console.log(`loading ${commandName}`);
  client.commands.set(commandName, command);
}

function newDateTime() { var today=new Date();var date=today.getFullYear()+"-"+(today.getMonth()+1).toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1,})+"-"+today.getDate().toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1});var time=today.getHours().toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1,})+":"+today.getMinutes().toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1,})+":"+today.getSeconds().toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1});dateTime=date+" "+time;return dateTime }

client.login(process.env.BOT_TOKEN);