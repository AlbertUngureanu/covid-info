const botcf = require("./botconfig.json");
const Discord = require("discord.js");
const BOT = new Discord.Client({disableEveryone: true});
const FS = require("fs");


BOT.commands = new Discord.Collection();


FS.readdir("./cmmds", (err, files) =>{
  if(err)
    return console.log(err);
  let jsF=files.filter(f => f.split(".").pop() === "js");
  if(jsF.lenght === 0)
    return console.log("Nu exista comenzi!");
  jsF.forEach((f, i) =>{
    let P = require(`./cmmds/${f}`);
    console.log(`Comanda -${f.split(".")[0]}- poate fi acum folosita!`);
    BOT.commands.set(P.help.name, P);
  });
});

BOT.on("ready", async() => {
  BOT.user.setStatus('dnd');
  return console.log(`Doctoru --${BOT.user.username}-- este gata de munca!`);
});

BOT.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm" || message.content[0]!==botcf.prefix) return ;
  let args = message.content.split(" ").slice(1);
  let cmdFile = BOT.commands.get(message.content.split(" ")[0].slice(1));
  if(cmdFile) return cmdFile.run(BOT,message,args);
});

BOT.login(botcf.token);
