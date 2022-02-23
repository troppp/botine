const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'))
const prefix = config.prefix;
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')

module.exports = async (client) => {
  client.user.setActivity(`${prefix}help    ;)`);
  // console.log("Bot is ready");
  let clientguilds = client.guilds.cache;
  console.log("\nserverlist:" + clientguilds.map((g) => ` ${g.name}`) || "None");
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

  const testID = '906774586987794483'
  const testGuild = client.guilds.cache.get(testID)
  /* let slashcommands;
  if (testGuild) { slashcommands = testGuild.commands } else { slashcommands = client.application?.commands }  */
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

  testGuild.commands.fetch()
  .then(commands => commands.forEach(commands => console.log(`Fetched ${commands.name} (${commands.description}) / command`)))
  .catch(console.error);
};