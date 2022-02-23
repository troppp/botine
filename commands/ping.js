const interactionCreate = require("../events/interactionCreate");

exports.run = (client, args, extraArgs, msg, slashcommand, interaction) => {
    if (slashcommand == 'true') {
        interaction.reply({ content: `${"```"}ping: ${Date.now() - interaction.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.${"```"}`, ephemeral: true});
    } else {
        msg.channel.send(`${"```"}ping: ${Date.now() - msg.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.${"```"}`);
    }
}

exports.name = "ping";