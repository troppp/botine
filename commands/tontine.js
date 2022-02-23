const { MessageEmbed } = require("discord.js");
const axios = require("axios");

exports.run = (client, args, extraArgs, msg, slashcommand, interaction) => {
    TontineData(client, args, extraArgs, msg, slashcommand, interaction)
}
exports.name = "tontine";

function TontineData(client, args, extraArgs, msg, slashcommand, interaction) {
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
        .setTimestamp(Date());
        
        if (slashcommand == 'true') {
          interaction.reply({ embeds: [tontineDataEmbed], ephemeral: true });
        } else {
          msg.channel.send({ embeds: [tontineDataEmbed] });
        }
    }
    makeGetRequest();
}