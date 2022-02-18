exports.run = (client, msg, args) => {
    msg.channel.send(`${"```"}ping: ${Date.now() - msg.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.${"```"}`);
}

exports.name = "ping";