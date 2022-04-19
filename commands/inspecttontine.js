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

exports.run = (client, args, extraArgs, msg, slashcommand, interaction) => {
    inspectTontine(msg, extraArgs, slashcommand, interaction)
}

exports.name = "inspecttontine";

async function inspectTontine(msg, embedType, slashcommand, interaction) {

  var args;

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
  
      if (tontineUser.length == 0) {
        if (slashcommand == 'true') {
          interaction.reply( { content: "That user doesn't exist! Please send a valid user.", ephemeral: true });
        } else {
          msg.reply("That user doesn't exist! Please send a valid user.");
        }
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

          let yesterday = moment((Date.now() - 86400000)).date()
          let today = moment().date()
          var alive = false
          if (moment(lastPressed).date() == yesterday || moment(lastPressed).date() == today) {
            alive = true
          }
  
          var offsetC;
          var embedColor;
          "aqua"==color?(offsetC=0,embedColor="#48e1f1"):"purple"==color?(offsetC=1,embedColor="#5638f5"):"pink"==color?(offsetC=2,embedColor="#a72ce9"):"red"==color?(offsetC=3,embedColor="#d90101"):"orange"==color?(offsetC=4,embedColor="#f17001"):"yellow"==color?(offsetC=5,embedColor="#ffef01"):"green"==color&&(offsetC=6,embedColor="#24bd3e");
          
          var imageName = `avatar-${offsetC + accountType * 7}.png`;
          var graveName = `grave-${graveType}.png`
          var imageLink = `https://trop.pw/files/tontine-sprites/${imageName}`;
          var graveLink = `https://trop.pw/files/tontine-sprites/${graveName}`;
  
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
            if (embedType === "dev" || embedType === "d") {
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
            } else if (embedType === "timestamp" || embedType === "t") {
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
            if (embedType === "dev" || embedType === "d") {
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
            } else if (embedType === "timestamp" || embedType === "t") {
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
        sendUserEmbed(msg, embedArray, slashcommand, interaction);
      }
    }
  }
  
  async function sendUserEmbed(msg, embedArray, slashcommand, interaction) {
    let filter;
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
        sentMsg = await interaction.reply({ embeds: [embedArray[0]], components: [row], fetchReply: true });
      } else {
        filter = (interaction) => interaction.user.id === msg.author.id;
        sentMsg = await msg.channel.send({ embeds: [embedArray[0]], components: [row], });
    }
      } else {
          if (slashcommand == 'true') {
            sentMsg = await interaction.reply({ embeds: embedArray, fetchReply: true })
          } else {
            sentMsg = await msg.channel.send({ embeds: embedArray });
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
