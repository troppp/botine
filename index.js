require("dotenv").config();

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
const fs = require("fs");
const prefix = "*";
const moment = require("moment");
const { maxHeaderSize } = require("http");

// autotontine logging
setInterval(TontineData, 300000);

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  client.user.setActivity(`${prefix}help    ;)`);
  console.log("Bot is ready");
  let clientguilds = client.guilds.cache;
  console.log(clientguilds.map((g) => g.name + " - " + g.id) || "None");
});

process.on("unhandledRejection", (error) => {
  console.log(error);
  console.log("phil or nick moment");
  global.lasterr = newDateTime() + " - " + error;
});

client.on("message", async (msg) => {
  if (!msg.author.bot) {
    if (msg.content.toLowerCase() === prefix + "help") {
      const normalHelpEmbed = new MessageEmbed().setColor("#48e1f1").addFields(
        {
          name: `tontine bot help menu`,
          value: `${prefix}help -> this menu\n${prefix}tontine -> sends embed with tontine data\n${prefix}inspecttontine <account_name> -> sends information about inserted tontine user\n${prefix}inspecttontinetimestamp <account_name> -> sends usual embed but with timestamp in your own local time\n${prefix}inspecttontinedev <account_name> -> sends same embed with a tad bit more information regarding grave number and such`,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: `shortcuts`,
          value: `${prefix}inspecttontine -> ${prefix}it\n${prefix}inspecttonetinetimestamp -> ${prefix}itt\n${prefix}inspecttontinedev -> ${prefix}itd`,
        }
      );
      msg.channel.send({ embeds: [normalHelpEmbed] });
    } else if (msg.content.toLowerCase() === prefix + "tontine") {
      TontineData(msg);
      // inspect tontine acc
    } else if (
      msg.content.toLowerCase().startsWith(prefix + "inspettontinestats") ||
      msg.content.toLowerCase().startsWith(prefix + "its")
    ) {
      // inspectTontineStats(msg)
      msg.channel.send("not done yet");
    } else if (
      msg.content
        .toLowerCase()
        .startsWith(prefix + "inspecttontinetimestamp") ||
      msg.content.toLowerCase().startsWith(prefix + "itt")
    ) {
      inspectTontine(msg, "timestamp");
    } else if (
      msg.content.toLowerCase().startsWith(prefix + "inspecttontinedev") ||
      msg.content.toLowerCase().startsWith(prefix + "itd")
    ) {
      inspectTontine(msg, "dev");
    } else if (
      msg.content.toLowerCase().startsWith(prefix + "inspecttontine") ||
      msg.content.toLowerCase().startsWith(prefix + "it")
    ) {
      inspectTontine(msg);
    } else if (msg.content.toLowerCase() === prefix + "lasterr") {
      msg.channel.send(lasterr)
    }
  }
});

async function inspectTontine(msg, embedType) {
  var args = msg.content.split(" ");
  args.shift();
  args[0] = args.join(" ");

  tontineUser = [];

  if (!args[0]) {
    msg.reply("Please provide a user to inspect!");
  } else {
    var res = await axios.get("http://localhost:8578");
    var tplfData = res.data.toString().split("#NLN#");

    var tontineUser;
    var embedArray = [];
    for (let i = 0; i < tplfData.length; i++) {
      var tplfUser = tplfData[i].split("#S#")[0].toString();
      if (args[0] === tplfUser) {
        tontineUser.push(tplfData[i].split("#S#"));
      }
    }

    if (tontineUser.length == 0) {
      msg.reply("That user doesn't exist! Please send a valid user.");
    } else {
      tontineUser.forEach(function (tontineUser) {
        var name = tontineUser[0];
        var color = tontineUser[1];
        var accountType = tontineUser[2];
        var graveType = tontineUser[3];
        var lastPressed = parseInt(tontineUser[4]);
        var lastPressedDate = new Date(lastPressed);
        lastPressedDate = utcToZonedTime(lastPressedDate, "America/New_York");
        var ts = parseInt(tontineUser[5]);
        var tsDateOrg = new Date(ts);
        tsDate = utcToZonedTime(tsDateOrg, "America/New_York");
        var alive = moment(lastPressed).isAfter((+new Date - 172800000), 'day')

        var offsetC;
        var embedColor;
        if (color == "aqua") {
          offsetC = 0;
          embedColor = "#48e1f1";
        } else if (color == "purple") {
          offsetC = 1;
          embedColor = "#5638f5";
        } else if (color == "pink") {
          offsetC = 2;
          embedColor = "#a72ce9";
        } else if (color == "red") {
          offsetC = 3;
          embedColor = "#d90101";
        } else if (color == "orange") {
          offsetC = 4;
          embedColor = "#f17001";
        } else if (color == "yellow") {
          offsetC = 5;
          embedColor = "#ffef01";
        } else if (color == "green") {
          offsetC = 6;
          embedColor = "#24bd3e";
        }
        var imageName = `avatar-${offsetC + accountType * 7}.png`;
        var graveName = `grave-${graveType}.png`
        var imageLink = `https://github.com/WetWipee/tontine/blob/577e698a435d84bd92a5bbc2e18b6a5368ee2769/tontine-sprites-resize/${imageName}?raw=true`;
        var graveLink = `https://github.com/WetWipee/tontine/blob/d0e80e6d4dc913fdae10d7de07862cac2d29491e/tontine-sprites-resize/${graveName}?raw=true`;

        var userInspectionEmbed = new MessageEmbed()
          .setColor(embedColor)
          .setTitle("Tontine User Inspection: ")
          if (alive == true) { 
            userInspectionEmbed
            .setThumbnail(imageLink) 
            .setFooter({ text: `last data update • ${moment(tsDateOrg).fromNow()}`, iconURL: graveLink })
          } else { 
            userInspectionEmbed
            .setThumbnail(graveLink)
            .setFooter({ text: `last data update • ${moment(tsDateOrg).fromNow()}`, iconURL: imageLink })
          }

        if (lastPressed != 0) {
          if (embedType === "dev") {
            userInspectionEmbed
              .setDescription(
                `name: **${name}**\ncolor: **${color}**\navatar: **${accountType}**\ngrave: **${graveType}**\nlast press: **${lastPressedDate.toLocaleString()}**\nalive: **${alive}**`
              )
              if (alive == true) { 
                userInspectionEmbed
                .setThumbnail(imageLink) 
                .setFooter({ text: `last data update • ${tsDate.toLocaleString()}`, iconURL: graveLink })
              } else { 
                userInspectionEmbed
                .setThumbnail(graveLink)
                .setFooter({ text: `last data update • ${tsDate.toLocaleString()}`, iconURL: imageLink })
              }
          } else if (embedType === "timestamp") {
            var lastPressedseconds = Math.round(lastPressed / 1000);
            userInspectionEmbed.setDescription(
              `name: **${name}**\nlast press: **<t:${lastPressedseconds.toString()}>**\nalive: **${alive}**`
            );
          } else {
            userInspectionEmbed.setDescription(
              `name: **${name}**\nlast press: **${lastPressedDate.toLocaleString()}**\nalive: **${alive}**`
            );
          }
        } else {
          if (embedType === "dev") {
            userInspectionEmbed
              .setDescription(
                `name: **${name}**\ncolor: **${color}**\navatar: **${accountType}**\ngrave: **${graveType}**\nlast press: **never**\nalive?: **${alive}**`
              )
              if (alive == true) { 
                userInspectionEmbed
                .setThumbnail(imageLink) 
                .setFooter({ text: `last data update • ${tsDate.toLocaleString()}`, iconURL: graveLink })
              } else { 
                userInspectionEmbed
                .setThumbnail(graveLink)
                .setFooter({ text: `last data update • ${tsDate.toLocaleString()}`, iconURL: imageLink })
              }
          } else if (embedType === "timestamp") {
            userInspectionEmbed.setDescription(
              `name: **${name}**\nlast press: **never**\nalive: **${alive}**`
            );
          } else {
            userInspectionEmbed.setDescription(
              `name: **${name}**\nlast press: **never**\nalive: **${alive}**`
            );
          }
        }

        embedArray.push(userInspectionEmbed);
      });
      sendUserEmbed(msg, embedArray);
    }
  }
}

async function sendUserEmbed(msg, embedArray) {
  var el = embedArray.length; // yktv
  var ce = 0; // current embed array index
  var rta = el - 1; // turn around point to cycle back to 0 (right side)

  var sentMsg;
  var row;
  var orgFooter = []

  if (embedArray.length > 1) {
    row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("left")
        .setLabel("⬅️")
        .setStyle("PRIMARY"),
      new MessageButton().setCustomId("stop").setLabel("🛑").setStyle("DANGER"),
      new MessageButton()
        .setCustomId("right")
        .setLabel("➡️")
        .setStyle("PRIMARY")
    );

    for (let i = 1; i <= embedArray.length; i++) {
      orgFooter.push(embedArray[i - 1].footer.text)
      embedArray[i - 1].footer.text = (`(${i.toString()}/${embedArray.length.toString()}) ` + embedArray[i - 1].footer.text.toString())
    }

    sentMsg = await msg.channel.send({
      embeds: [embedArray[0]],
      components: [row],
    });
  } else {
    sentMsg = await msg.channel.send({ embeds: embedArray });
  }

  const filter = (i = Discord.Interaction) => {
    return msg.author.id === i.user.id;
  };

  const collector = msg.channel.createMessageComponentCollector({
    filter,
    time: 1000 * 120,
  });

  collector.on("collect", (i = Discord.Interaction) => {
    if (i.customId === "right") {
      if (ce != rta) {
        ce += 1;
        i.update({ embeds: [embedArray[ce]], components: [row] });
      } else {
        ce = 0;
        i.update({ embeds: [embedArray[ce]], components: [row] });
      }
    } else if (i.customId === "left") {
      if (ce != 0) {
        ce -= 1;
        i.update({ embeds: [embedArray[ce]], components: [row] });
      } else {
        ce = rta;
        i.update({ embeds: [embedArray[ce]], components: [row] });
      }
    } else if (i.customId === "stop") {
      embedArray[ce].footer.text = orgFooter[ce]
      i.update({ embeds: [embedArray[ce]], components: [] }).then((_) => collector.stop())
    }
  });

  collector.on("end", (collection) => {
    sentMsg.edit({ components: [] });
  });
}

function TontineData(msg, manual) {
  async function makeGetRequest() {
    let res = await axios.get(
      "https://tontine-stats.s3.us-east-1.amazonaws.com/stats.json"
    );
    global.TontineData = res.data;
    var alive = global.TontineData.alive.toString();
    var dead = global.TontineData.dead.toString();
    var safe = global.TontineData.safe.toString();
    var total = global.TontineData.total.toString();
    var ytc = (alive - safe).toString();

    if (!manual) {
      fs.appendFileSync(
        "logs/tontinestatlogs.txt",
        "#5# | " +
          newDateTime() +
          " | Alive: " +
          alive +
          " | Dead: " +
          dead +
          " | Safe: " +
          safe +
          " | Total: " +
          total +
          " | People Yet to Click: " +
          ytc +
          "\n"
      );
    } else {
      fs.appendFileSync(
        "logs/tontinestatlogs.txt",
        "#M# | " +
          newDateTime() +
          " | Alive: " +
          alive +
          " | Dead: " +
          dead +
          " | Safe: " +
          safe +
          " | Total: " +
          total +
          " | People Yet to Click: " +
          ytc +
          "\n"
      );
    }

    if (msg) {
      const tontineDataEmbed = new MessageEmbed()
        .setColor("#000000")
        .setTitle("le tontine.")
        // .setDescription(`Alive: **${alive}**\nDead: **${dead}**\nSafe: **${safe}**\nUnsafe: **${ytc}**\nTotal: **${total}**`)
        .setDescription(
          "```Alive:  " +
            alive +
            "\nDead:   " +
            dead +
            "\nSafe:   " +
            safe +
            "\nUnsafe: " +
            ytc +
            "\nTotal:  " +
            total +
            "```"
        )
        .setFooter("data gathered")
        .setTimestamp(Date());
      msg.channel.send({ embeds: [tontineDataEmbed] });
    }
  }
  makeGetRequest();
}

function newDateTime() {
  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "-" +
    today
      .getDate()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  var time =
    today.getHours().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ":" +
    today.getMinutes().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ":" +
    today
      .getSeconds()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  dateTime = date + " " + time;
  return dateTime;
}
