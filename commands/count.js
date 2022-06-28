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
    getCount(msg, args)
}

exports.name = "count";

async function getCount(msg, args) {
    let count = 0
    let dmsg = ''
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
              count += 1
              dmsg = "are alive"
            } else if (!alive && args[0] == "dead") {
              count += 1
              dmsg = "are dead"
            }
        } // end of for loop
    } else if (args[0] == "unsafe") {
        dmsg = "are unsafe"
        for (let i = 0; i < tplfData.length; i++) {
            let tplfUser = tplfData[i].split("#S#")
            let lastPressed = parseInt(tplfUser[4]);
            let lpMoment = moment(lastPressed)

            if (lpMoment.date() == yesterday && lpMoment.month() == yMonth && lpMoment.year() == yYear) {
              count += 1
            }
        } // end of for loop
    } else if (args[0] == "lastd") {
      dmsg = "died today"
      let yYesterday = moment(Date.now() - 172800000).date()
      let yyMonth = moment(Date.now() - 172800000).month()
      let yyYear = moment(Date.now() - 172800000).year()

      for (let i = 0; i < tplfData.length; i++) {
          let tplfUser = tplfData[i].split("#S#")
          let lastPressed = parseInt(tplfUser[4]);
          let lpMoment = moment(lastPressed)

          if (lpMoment.date() == yYesterday && lpMoment.month() == yyMonth && lpMoment.year() == yyYear) {
              count += 1
            }
      } // end of for loop
    } else if (args[0] == "lasth") {
    dmsg = "clicked in the last hour"
      let hour = moment().hour()
      let lHour = moment(Date.now() - 3600000).hour()
      for (let i = 0; i < tplfData.length; i++) {
        let tplfUser = tplfData[i].split("#S#")
        let lastPressed = parseInt(tplfUser[4]);
        let lpMoment = moment(lastPressed)

        if ((lpMoment.hour() == hour || lpMoment.hour() == lHour) && lpMoment.date() == today && lpMoment.month() == month && lpMoment.year() == year) {
            count += 1
          }
      } // end of for loop
    } else if (args[0] == "searchd") {
        dmsg = `died on ${moment(((new Date(`${args[1]} ${args[2]} ${args[3]}`)).getTime())).format('MMMM Do YYYY')}`

        sDate = moment(((new Date(`${args[1]} ${args[2]} ${args[3]}`)).getTime()) - 86400000)
        sdate = sDate.date()
        smonth = sDate.month()
        syear = sDate.year()
        if (sdate == 27 && smonth == 11 && syear == 2021) {
          sdate = 31
          smonth = 11
          syear = 1969
        }

        for (let i = 0; i < tplfData.length; i++) {
          let tplfUser = tplfData[i].split("#S#")
          let lastPressed = parseInt(tplfUser[4]);
          let lpMoment = moment(lastPressed)

          if (lpMoment.date() == sdate && lpMoment.month() == smonth && lpMoment.year() == syear && !(sdate == yesterday && syear == yYear && smonth == yMonth)) {
              count += 1
            }
         } // end of for loop
    } else {
        for (let i = 0; i < tplfData.length; i++) {
            let tplfUser = tplfData[i].split("#S#")
            count += 1
        } // end of for loop
    }

    //return [...new Set(tontineList)].sort()
    msg.reply(`${count.toString()} players ${dmsg}`)
}