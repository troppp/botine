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
const chunk = require('lodash.chunk');

exports.run = (client, args, extraArgs, msg, slashcommand, interaction) => {
    constructList(msg, slashcommand, interaction, args)
}

exports.name = "inspecttontinelist";

const listSize = 20;

async function getList(args) {
    /*
    tontine tplf #S# params
    0: name
    1: color
    2: account type
    3: grave type
    4: unix time last pressed
    5: unix time of last data update
    */
    let res = await axios.get("http://localhost:8578");
    let tplfData = res.data.toString().split("#NLN#");
    let tontineList = []

    let yesterday = moment(Date.now() - 86400000).date()
    let yMonth = moment(Date.now() - 86400000).month()
    let yYear = moment(Date.now() - 86400000).year()
    let today = moment().date()
    let month = moment().month()
    let year = moment().year()

    // alive list
    if (args[0] == "alive" || args[0] == "dead") {
        for (let i = 0; i < tplfData.length; i++) {
            let tplfUser = tplfData[i].split("#S#")
            let lastPressed = parseInt(tplfUser[4]);
            let lpMoment = moment(lastPressed)

            let alive = false
            if (lpMoment.date() == yesterday && lpMoment.month() == yMonth && lpMoment.year() == yYear
            || lpMoment.date() == today && lpMoment.month() == month && lpMoment.year() == year) 
            { alive = true }

            if (alive && args[0] == "alive") {
              tontineList.push(tplfUser[0].trim());
            } else if (!alive && args[0] == "dead") {
              tontineList.push(tplfUser[0].trim());
            }
        } // end of for loop
    } else if (args[0] == "unsafe") {
        for (let i = 0; i < tplfData.length; i++) {
            let tplfUser = tplfData[i].split("#S#")
            let lastPressed = parseInt(tplfUser[4]);
            let lpMoment = moment(lastPressed)

            if (lpMoment.date() == yesterday && lpMoment.month() == yMonth && lpMoment.year() == yYear) {
              tontineList.push(tplfUser[0].trim());
            }
        } // end of for loop
    } else if (args[0] == "lastd") {
      let yYesterday = moment(Date.now() - 172800000).date()
      let yyMonth = moment(Date.now() - 172800000).month()
      let yyYear = moment(Date.now() - 172800000).year()

      for (let i = 0; i < tplfData.length; i++) {
          let tplfUser = tplfData[i].split("#S#")
          let lastPressed = parseInt(tplfUser[4]);
          let lpMoment = moment(lastPressed)

          if (lpMoment.date() == yYesterday && lpMoment.month() == yyMonth && lpMoment.year() == yyYear) {
              tontineList.push(tplfUser[0].trim());
            }
      } // end of for loop
    } else if (args[0] == "lasth") {
      let hour = moment().hour()
      let lHour = moment(Date.now() - 3600000).hour()
      for (let i = 0; i < tplfData.length; i++) {
        let tplfUser = tplfData[i].split("#S#")
        let lastPressed = parseInt(tplfUser[4]);
        let lpMoment = moment(lastPressed)

        if ((lpMoment.hour() == hour || lpMoment.hour() == lHour) && lpMoment.date() == today && lpMoment.month() == month && lpMoment.year() == year) {
            tontineList.push(tplfUser[0].trim());
          }
      } // end of for loop
    } else if (args[0] == "searchd") {
        sDate = moment(((new Date(`${args[1]} ${args[2]} ${args[3]}`)).getTime()) - 86400000)
        sdate = sDate.date()
        smonth = sDate.month()
        syear = sDate.year()

        for (let i = 0; i < tplfData.length; i++) {
          let tplfUser = tplfData[i].split("#S#")
          let lastPressed = parseInt(tplfUser[4]);
          let lpMoment = moment(lastPressed)

          if (lpMoment.date() == sdate && lpMoment.month() == smonth && lpMoment.year() == syear && !(sdate == yesterday && syear == yYear && smonth == yMonth)) {
              tontineList.push(tplfUser[0].trim());
            }
         } // end of for loop
    } else {
        for (let i = 0; i < tplfData.length; i++) {
            let tplfUser = tplfData[i].split("#S#")
            tontineList.push(tplfUser[0].trim());
        } // end of for loop
    }

    //return [...new Set(tontineList)].sort()
    return tontineList.sort()
}

function segmentList(tontineList, args) {
    if (!args[0]) { args = "all" }
    let embedArray = []
    let tontineListChunks = chunk(tontineList, listSize)

    if (tontineListChunks.length > 1) {
        tontineListChunks.forEach(function (list) {
            let listConcatenated = '```'
            list.forEach(function (name) {
                listConcatenated += `${name}\n`
            })
            listConcatenated += '```'

            let listEmbed = new MessageEmbed()
                .setTitle("Tontine User List - " + args)
                .setColor("#583cf4")
                .setDescription(listConcatenated)
                .setFooter({ text: "" })
            embedArray.push(listEmbed)
        })
    } else if (tontineList.length > 0) {
        let listConcatenated = '```'
        tontineList.forEach(function (name) {
            listConcatenated += `${name}\n`
        })
        listConcatenated += '```'

        let listEmbed = new MessageEmbed()
            .setTitle("Tontine User List - " + args)
            .setColor("#583cf4")
            .setDescription(listConcatenated)
        embedArray.push(listEmbed)
    } else {
        let listEmbed = new MessageEmbed()
              .setTitle("Tontine User List - " + args)
              .setColor("#583cf4")
              .setDescription("```No results found.```")
          embedArray.push(listEmbed)
    }

    return embedArray
}

async function sendEmbed(msg, embedArray, slashcommand, interaction) {
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

function constructList(msg, slashcommand, interaction, args){
    getList(args).then((tontineList) =>
    segmentList(tontineList, args)).then((embedArray) => 
    sendEmbed(msg, embedArray, slashcommand, interaction))
}