module.exports = (client, msg) => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(client.config.prefix) !== 0) return;
    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    let extraArgs;

    // tontine shortcuts ( WILL BE MOVED TO MODULE SOON^TM )
    // or not idk this works pretty well
    if (command.startsWith("itl") || command.startsWith("inspecttontinelist")) {
        oldcmd = command
        command = "inspecttontinelist"
    } else if (command.startsWith("it") || command.startsWith("inspecttontine")) {
        oldcmd = command
        command = "inspecttontine"
        if (oldcmd.slice(2) == "t" || oldcmd.slice(14) == "timestamp") {
            extraArgs = "timestamp"
        } else if (oldcmd.slice(2) == "d" || oldcmd.slice(14) == "dev") {
            extraArgs = "dev"
        }
    }
  
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, args, extraArgs, msg, 'false');
  };