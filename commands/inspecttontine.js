const Discord = require("discord.js");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const { utcToZonedTime } = require("date-fns-tz");
const axios = require("axios");
const moment = require("moment");
require('moment-timezone');
moment.tz.setDefault("America/New_York");
const fs = require("fs");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");

exports.run = (client, args, extraArgs, msg, slashcommand, interaction) => {
    inspectTontine(msg, extraArgs, slashcommand, interaction)
}

exports.name = "inspecttontine";

async function loadEmbed(embedType) {
  var loadEmbed = new MessageEmbed()
    .setColor("#808080")
    .setTitle("Tontine User Inspection: ")
    .setFooter(`last data update • loading`)
    
    if (embedType === "dev" || embedType === "d") {
      loadEmbed
        .setDescription(`name: **loading**\ncolor: **loading**\navatar: **loading**\ngrave: **loading**\nlast press: **loading**\nalive: **loading**\nsafe: **loading**\ndays lived: **loading**\nchecked: **loading**`)
    } else {
      loadEmbed
        .setDescription(`name: **loading**\nlast press: **loading**\nalive: **loading**\nsafe: **loading**\ndays lived: **loading**\nchecked: **loading**`);
    }

    return [loadEmbed]
}

async function inspectTontine(msg, embedType, slashcommand, interaction) {

  var args;
  let sentMsg;

  if (slashcommand == 'false') {
    args = msg.content.split(" ");
    args.shift();
    args[0] = args.join(" ");
  } else {
    args = interaction.options.get('account').value.split(" ");
    args[0] = args.join(" ")
  }

    tontineUser = [];

    if (!args[0]) {
      msg.reply("Please provide a user to inspect!");
    } else {
      if (slashcommand == 'false') {
        sentMsg = await msg.channel.send({ embeds: await loadEmbed(embedType) })
      } else {
        sentMsg = await interaction.reply({ embeds: await loadEmbed(embedType), fetchReply: true })
      }

      var res = await axios.get("http://localhost:8578");
      var tplfData = res.data.toString().split("#NLN#");

      var tontineUser;
      var embedArray = [];
      for (let i = 0; i < tplfData.length; i++) {
        var tplfUser = tplfData[i].split("#S#")[0].toString()
        if (args[0].toLowerCase().trim() === tplfUser.toLowerCase().trim()) {
          tontineUser.push(tplfData[i].split("#S#"));
        }
      }
  
      let countJSON = JSON.parse(await fs.readFileSync("./sources/it.json", (err) => {if (err) {console.log(err)}})).counts

      if (tontineUser.length == 0) {
        let usernotreal = new MessageEmbed()
          .setTitle("That user doesn't exist! Please send a valid user.")
          .setColor("ff0000")
        if (slashcommand == 'true') {
          sentMsg.edit( { embeds: [usernotreal] });
        } else {
          sentMsg.edit( { embeds: [usernotreal] } );
        }
      } else {
        tontineUser.forEach(function (tontineUser) {

          // count
          tontineUserNOTIME = tontineUser.slice(0,4)
          countJSON[tontineUserNOTIME] = countJSON[tontineUserNOTIME] ? (countJSON[tontineUserNOTIME] + 1) : 1
          let count = countJSON[tontineUserNOTIME]
          
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

          let yesterday = moment(Date.now() - 86400000).date()
          let yMonth = moment(Date.now() - 86400000).month()
          let yYear = moment(Date.now() - 86400000).year()
          let today = moment().date()
          let month = moment().month()
          let year = moment().year()
          let alive = false
          let safe = false
          let lpMoment = moment(lastPressed)
          if (lpMoment.date() == yesterday && lpMoment.month() == yMonth && lpMoment.year() == yYear) 
            { alive = true }
          if (lpMoment.date() == today && lpMoment.month() == month && lpMoment.year() == year)
            { alive = true; safe = true }
          var offsetC;
          var embedColor;
          "aqua"==color?(offsetC=0,embedColor="#48e1f1"):"purple"==color?(offsetC=1,embedColor="#5638f5"):"pink"==color?(offsetC=2,embedColor="#a72ce9"):"red"==color?(offsetC=3,embedColor="#d90101"):"orange"==color?(offsetC=4,embedColor="#f17001"):"yellow"==color?(offsetC=5,embedColor="#ffef01"):"green"==color&&(offsetC=6,embedColor="#24bd3e");
          
          var imageName;
          var graveName;
          if (name == "bottlecaps") {
            imageName = `avatar-${offsetC + accountType * 7}-bottlecaps.png`;
            graveName = `grave-${graveType}-bottlecaps.png`
          } else {
            imageName = `avatar-${offsetC + accountType * 7}.png`;
            graveName = `grave-${graveType}.png`
          }
         
          var imageLink = `https://trop.pw/files/tontine-sprites/${imageName}`;
          var graveLink = `https://trop.pw/files/tontine-sprites/${graveName}`;
          // in case server is down ;(
          // var imageLink = `https://github.com/WetWipee/tontine/blob/d0e80e6d4dc913fdae10d7de07862cac2d29491e/tontine-sprites-resize/${imageName}?raw=true`;
          // var graveLink = `https://github.com/WetWipee/tontine/blob/d0e80e6d4dc913fdae10d7de07862cac2d29491e/tontine-sprites-resize/${graveName}?raw=true`;

          var startDate = moment([2021, 11, 28])
          var totalDays = lpMoment.diff(startDate, 'days') + 1
  
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
  
            // "days lived" by marc ig lOL not really he didnt do anyhting he nevr does anything LSOER LOL

          if (lastPressed != 0) {
            if (embedType === "dev" || embedType === "d") {
              userInspectionEmbed
                .setDescription(
                  `name: **${name}**\ncolor: **${color}**\navatar: **${accountType}**\ngrave: **${graveType}**\nlast press: **${lastPressedDate.toLocaleString()}**\nalive: **${alive}**\nsafe: **${safe}**\ndays lived: **${totalDays}**\nchecked: **${count} times**`
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
            } else if (embedType === "timestamp" || embedType === "t") {
              var lastPressedseconds = Math.round(lastPressed / 1000);
              userInspectionEmbed.setDescription(
                `name: **${name}**\nlast press: **<t:${lastPressedseconds.toString()}>**\nalive: **${alive}**\nsafe: **${safe}**\ndays lived: **${totalDays}**\nchecked: **${count} times**`
              );
            } else {
              userInspectionEmbed.setDescription(
                `name: **${name}**\nlast press: **${lastPressedDate.toLocaleString()}**\nalive: **${alive}**\nsafe: **${safe}**\ndays lived: **${totalDays}**\nchecked: **${count} times**`
              );
            }
          } else {
            if (embedType === "dev" || embedType === "d") {
              userInspectionEmbed
                .setDescription(
                  `name: **${name}**\ncolor: **${color}**\navatar: **${accountType}**\ngrave: **${graveType}**\nlast press: **never**\nalive: **${alive}**\nsafe: **${safe}**\nchecked: **${count} times**`
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
            } else if (embedType === "timestamp" || embedType === "t") {
              userInspectionEmbed.setDescription(
                `name: **${name}**\nlast press: **never**\nalive: **${alive}**\nsafe: **${safe}**\nchecked: **${count} times**`
              );
            } else {
              userInspectionEmbed.setDescription(
                `name: **${name}**\nlast press: **never**\nalive: **${alive}**\nsafe: **${safe}**\nchecked: **${count} times**`
              );
            }
          }
  
          embedArray.push(userInspectionEmbed);
        });
        sendUserEmbed(msg, embedArray, slashcommand, interaction, sentMsg);

        // write to JSON file :100:
        countJSONupdated = JSON.parse(await fs.readFileSync("./sources/it.json", (err) => {if (err) {console.log(err)}}))
        countJSONupdated.counts = countJSON
        fs.writeFileSync("./sources/it.json", JSON.stringify(countJSONupdated))
      }
    }
  }
  
  async function sendUserEmbed(msg, embedArray, slashcommand, interaction, sentMsg) {
    let filter;
    var el = embedArray.length; // yktv
    var ce = 0; // current embed array index
    var rta = el - 1; // turn around point to cycle back to 0 (right side)
  
    var row;
    var orgFooter = []
  
    if (embedArray.length > 1) {
      row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("left")
          .setLabel("⬅️")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("stop")
          .setLabel("🛑")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("right")
          .setLabel("➡️")
          .setStyle("PRIMARY")
      );
  
      for (let i = 1; i <= embedArray.length; i++) {
        orgFooter.push(embedArray[i - 1].footer.text)
        embedArray[i - 1].footer.text = (`(${i.toString()}/${embedArray.length.toString()}) ` + embedArray[i - 1].footer.text.toString())
      }
  
      if (slashcommand == 'true') {
        var firstinteractionuserid = interaction.user.id
        filter = (interaction) => interaction.user.id === firstinteractionuserid;
        sentMsg.edit({ embeds: [embedArray[0]], components: [row], fetchReply: true });
      } else {
        filter = (interaction) => interaction.user.id === msg.author.id;
        sentMsg.edit({ embeds: [embedArray[0]], components: [row], });
    }
      } else {
          if (slashcommand == 'true') {
            sentMsg.edit({ embeds: embedArray })
          } else {
            sentMsg.edit({ embeds: embedArray });
          }
      }

      const collector = sentMsg.createMessageComponentCollector({ filter, time: 1000 * 120, });

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
    
      collector.on("end", () => {
        sentMsg.edit({ components: [] });
      });

  }
