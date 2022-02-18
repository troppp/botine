const fs = require("fs");

require("dotenv").config();
const config = JSON.parse(fs.readFileSync('./config.json'))

const Discord = require("discord.js");
const {
  Client,
  Intents,
  permissions,
  kick,
  MessageEmbed,
  MessageAttachment,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES"],
});
const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");
const axios = require("axios");

const prefix = config.prefix
const moment = require("moment");
const { maxHeaderSize } = require("http");

client.on("ready", () => {
  client.user.setActivity(`${prefix}help    ;)`);
  // console.log("Bot is ready");
  let clientguilds = client.guilds.cache;
  console.log("\nserverlist:" + clientguilds.map((g) => ` ${g.name}`) || "None");
  console.log(`                            
                    ....          ....            
                    :xkx,        .okkl.           
                 ...:ooo'        .cooc'...        
               .:xxd,                .lxxo.       
                :ddo,................'lddl.       
                 ...:ddddddddddddddddl'..         
                    ;xxxkkkOOkxxxxkOOo.           
                     ...cxkOkl...;xOOo.           
                       .:xkOkc.  'okkl.           
                    ,lloxkkOOxoll:'...            
                    :kkkkkkkkkkkkc.               
                    .....'''''''',cllllll:.       
                                 'dOOOOOOd'       
           .,cc;.       .::ccccccokOOd:,',:cc:.   
           .oOOd'       ;xkOOOOOOOOOOo.  .lOOx,   
       .,:::;,,,;::;.   ;xkOOOOOOOOOOo.  .lOOx,   
       .dOOo.  .lOOx,   ;xkOOOOOOOOOOo.  .lOOx,   
       .dOOo.   .;;,.   ;xkOOOOOOOOOOo.   .;;,.   
       .dOOo.           ;xkOOOOOOOOOOo.           
       .,:::;,,'        .;;::okOOdc:::;,,'.       
           .oOOd.            ,xOOl.  .oOOd.       
        .'',:cc;.       ..''';:cc,   .oOOd.       
       .dOko.           ;xkOk:       .oOOd.       
       .dOOo.           ;xkOk:       .oOOd.       

       "data is a powerful weapon in a silent war"
            - trop
            
logged in as: ${client.user.username}#${client.user.discriminator} with prefix ${prefix}
  `)
});

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