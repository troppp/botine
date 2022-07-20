const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'))
const prefix = config.prefix;
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders')
const activity = `${prefix}help    ;)`

module.exports = async (client) => {
  function refreshActivity() {
    client.user.setActivity(activity, { type: "COMPETING" });
  }
  refreshActivity(client)
  setInterval(refreshActivity, 3600000)

  console.log(`
set activity to: ${activity}`)

  // console.log("Bot is ready");
  let clientguilds = client.guilds.cache;
  console.log("serverlist:" + clientguilds.map((g) => ` ${g.name}`) || "None");
  console.log(`                            
                    ....          ....            
                    :xkx,        .okkl.           
                 ...:ooo'        .cooc'...        
               .:xxd,                .lxxo.       
                :ddo,................'lddl.       
                 ...:ddddddddddddddddl'..         
                    ;xxxkkkOOkxxxxkOOo.           
                     ...cxkOkl...;xOOo.           
                       .:xkOkc.  'okkl.           
                    ,lloxkkOOxoll:'...            
                    :kkkkkkkkkkkkc.               
                    .....'''''''',cllllll:.       
                                 'dOOOOOOd'       
           .,cc;.       .::ccccccokOOd:,',:cc:.   
           .oOOd'       ;xkOOOOOOOOOOo.  .lOOx,   
       .,:::;,,,;::;.   ;xkOOOOOOOOOOo.  .lOOx,   
       .dOOo.  .lOOx,   ;xkOOOOOOOOOOo.  .lOOx,   
       .dOOo.   .;;,.   ;xkOOOOOOOOOOo.   .;;,.   
       .dOOo.           ;xkOOOOOOOOOOo.           
       .,:::;,,'        .;;::okOOdc:::;,,'.       
           .oOOd.            ,xOOl.  .oOOd.       
        .'',:cc;.       ..''';:cc,   .oOOd.       
       .dOko.           ;xkOk:       .oOOd.       
       .dOOo.           ;xkOk:       .oOOd.       

       "data is a powerful weapon in a silent war"
            - trop

logged in as: ${client.user.username}#${client.user.discriminator} with prefix ${prefix}
  `)

  // checks for json and if it isn't there it makes it or smth idfk.
  try {
    fs.readFileSync("./sources/it.json") 
  } catch {
    console.log("file doesn't exist ima make it for you lazy bitch")
    fs.writeFile("./sources/it.json", `{"counts":{}}`, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log("there made ur fucking file bitch\n")
      }
    })
  }

  const testID = '906774586987794483'
  const testGuild = client.guilds.cache.get(testID)
  // let slashcommands;
  // if (testGuild) { slashcommands = testGuild.commands } else { slashcommands = client.application?.commands }
  let slashcommands = client.application?.commands

  const pingslash = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with ping')
  slashcommands?.create(pingslash)

  const itslash = new SlashCommandBuilder()
    .setName('inspecttontine')
    .setDescription('sends user inspection embed')
    .addStringOption(
        new SlashCommandStringOption()
            .setName('account')
            .setDescription('account to inspect')
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName('type')
            .setDescription('embed that sends with local timestamp or extra dev results')
            .addChoice('timestamp', 'timestamp')
            .addChoice('dev', 'dev')
    )
  slashcommands?.create(itslash)

  const help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('sends help embed')
  slashcommands?.create(help)

  const tontine = new SlashCommandBuilder()
    .setName('tontine')
    .setDescription('sends embed with tontine data')
  slashcommands?.create(tontine)

  /* const itlslash = new SlashCommandBuilder()
    .setName('tontinelist')
    .setDescription("sends list of whatever you choose")
    .addStringOption(
      new SlashCommandStringOption()
            .setName('type')
            .setDescription('what kind you want foo?')
            .addChoice('alive', 'alive')
            .addChoice('dead', 'dead')
            .addChoice('unsafe', 'unsafe')
            .addChoice('lasth', 'who clicked in the last hour')
            .addChoice('lastd', 'who died today')
            .addChoice('searchd', 'search by death date <month day year>')
            .addChoice('all', 'list of all players')
            .setRequired(true)
    )
  slashcommands?.create(itlslash) */

  testGuild.commands.fetch()
  .then(commands => commands.forEach(function (commands) {
      // commands.delete()
      return console.log(`Fetched ${commands.name} (${commands.description}) / command`);
    }))
  .catch(console.error);
};