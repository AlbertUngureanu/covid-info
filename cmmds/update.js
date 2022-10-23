const Discord = require("discord.js");
const sCrap = require('puppeteer');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function timeLeft(){
    var dC = new Date();
    return (-dC + dC.setHours(10,35,0,0));
}

async function cazuriConfirmate(chn){
  const bR = await sCrap.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const pG = await bR.newPage();
  const URL = `https://covid19.geo-spatial.org/dashboard/main`;
  pG.setViewport({width:1920, height:1080, deviceScaleFactor:2});
  await pG.goto(URL);
  await sleep(500);
  let elNrCazuriTotale = await pG.$(`#custom-grid > div:nth-child(1) > div > p-card > div > div > div.ui-card-content > h1`);
  const nrCazuriTotale = await pG.evaluate(elNrCazuriTotale => elNrCazuriTotale.textContent, elNrCazuriTotale);
  let elNrVindecariTotale = await pG.$(`#custom-grid > div:nth-child(1) > div:nth-child(1) > div > p-card > div > div > div.ui-card-content > h1`);
  const nrVindecariTotale = await pG.evaluate(elNrVindecariTotale => elNrVindecariTotale.textContent, elNrVindecariTotale);
  let elNrDeceseTotale = await pG.$(`#custom-grid > div:nth-child(2) > div:nth-child(1) > div > p-card > div > div > div.ui-card-content > h1`);
  const nrDeceseTotale = await pG.evaluate(elNrDeceseTotale => elNrDeceseTotale.textContent, elNrDeceseTotale);
  var arrC = [];
  for(var i=1;i<=39;i++)
  {
    let elemC = await pG.$(`#custom-grid > div:nth-child(2) > div > div > div > div > p-table > div > div > table > tbody > tr:nth-child(${i})`);
    const elC = await pG.evaluate(elemC => elemC.textContent, elemC);
    const nume = elC.split(" ")[1];
    const nR = elC.split(" ")[0];
    if(nume==="SATU") var nElC = nume + " MARE: " + `[${nR}](https://covid19.geo-spatial.org/dashboard/main)`;
    else var nElC = nume + ": " + `[${nR}](https://covid19.geo-spatial.org/dashboard/main)`;
    arrC.push(nElC);
  }

  await pG.goto('https://apps.sage.ieat.ro/covid19/charts/embedded/dailycases.html');
  const el = await pG.$('#canvasDailyCases');
  await sleep(500);
  await el.screenshot({path: 'poza.png'});

  bR.close();
  arrC.sort();
  var arrC1 = [], arrC2 = [], arrC3 = [];
  for(var i=0;i<=38;i++)
  {
    if(i<=12) arrC1.push(arrC[i]);
    else if(i<=25) arrC2.push(arrC[i]);
          else arrC3.push(arrC[i]);
  }
  const attach = new Discord.MessageAttachment('./poza.png', 'poza.png');
  let mEmb = new Discord.MessageEmbed()
  .attachFiles(attach)
  .setColor('#2f3136')
  .setDescription(`Statistici Generale: **${nrCazuriTotale}** cazuri, **${nrVindecariTotale}** vindecari, **${nrDeceseTotale}** decese`)
  .setImage('attachment://poza.png')
  .setFooter("Informatiile sunt actualizate zilnic in jurul orei 13:30.")
  .addField('‎ ', arrC1, true)
  .addField('‏‏‎ ‎', arrC2, true)
  .addField('‏‏‎ ‎', arrC3, true);
  return mEmb;
}

module.exports.run = async (bot, msg, args) => {
  if(msg.guild.me.hasPermission("MANAGE_MESSAGES")) msg.delete().catch();
  if(msg.author.id === '525335062464561162')
  {
    const cH =  msg.client.channels.cache.get(msg.content.split(" ")[1]);
    const iD = msg.content.split(" ")[2];
    if(iD)
    {
        const em = await cazuriConfirmate(cH);
        cH.messages.fetch(iD).then(m =>m.edit(em));
    }
    else
    {
      if(cH)
      {
        const em = await cazuriConfirmate(cH);
        cH.send(em);
      }
      else
      {
        const em = await cazuriConfirmate(cH);
        msg.channel.send(em);
      }
    }
  }
}

module.exports.help = {
  name: "u"
}
