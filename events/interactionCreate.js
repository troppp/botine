const fs = require('fs')

let msg = ''
let args = ''
let extraArgs = ''

async function getData(ct) {
    let taarray = []
    if (ct != '') {
        var names = (fs.readFileSync('sources/tontine-accounts.txt').toString())
        names = names.split('\n')
        names.forEach(function (usern) {
                if (usern.startsWith(ct)) {
                    taarray.push({ name: usern, value: usern });
                }
            })
    }
    return taarray.slice(0,25)
}

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction

        const cmd = client.commands.get(commandName);
        if (!cmd) return;

        if (commandName === 'ping') {
            cmd.run(client, args, extraArgs, msg, 'true', interaction);
        } else if (commandName === 'inspecttontine') {
            let extraArgs2 = ''
            if (interaction.options.get('type')) {
                extraArgs2 = interaction.options.get('type').value
            }
            cmd.run(client, args, extraArgs2, msg, 'true', interaction);
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