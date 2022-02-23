const axios = require('axios')

let msg = ''
let args = ''
let extraArgs = ''

async function getData(ct) {
    let taarray = []
    let taarrayFinal = []
    if (ct != '') {
        var res = await axios.get("http://localhost:8578");
        var tplfData = res.data.toString().split("#NLN#");
        tplfData.forEach(function (account) {
                var tplfUser = account.split("#S#")[0].toString().toLowerCase();
                if (tplfUser.startsWith(ct)) {
                    taarray.push(tplfUser);
                }
            })
    }

    taarray = [...new Set(taarray)].sort()

    taarray.forEach(function (user) {
        taarrayFinal.push({ name: user, value: user });
    })

    return taarrayFinal.slice(0,25)
}

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction

        const cmd = client.commands.get(commandName);
        if (!cmd) return;

        if (commandName === 'ping') {
            cmd.run(client, args, extraArgs, msg, 'true', interaction);
        } else if (commandName === 'inspecttontine') {
            if (interaction.options.get('type')) {
                extraArgs = interaction.options.get('type').value
            }
            cmd.run(client, args, extraArgs, msg, 'true', interaction);
        } else if (commandName === 'help') {
            cmd.run(client, args, extraArgs, msg, 'true', interaction)
        } else if (commandName === 'tontine') {
            cmd.run(client, args, extraArgs, msg, 'true', interaction)
        }

    }

    if (interaction.isAutocomplete()) {
        var ct = interaction.options.getString('account').toLowerCase()
        let taarray = await getData(ct)
        interaction.respond(
           taarray
        )
    }

  };