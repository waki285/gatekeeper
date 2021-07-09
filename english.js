"use strict";

//Define

const discord = require("discord.js");
const client = new discord.Client({partials: ["MESSAGE", "REACTION", "CHANNEL"]});
const disbtn = require("discord.js-buttons")(client);

require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const fetch = require("node-fetch");
const { Signale } = require("signale");
const logger = new Signale();

const config = require("./config.json");
const pool = require("./pool");
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
const prefix = "!";

//Web Page Settings

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

//Discord
client.on('ready', () => {
  logger.success(`Logged in as ${client.user.tag}!`);
});
client.on('message', async message => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "verify") {
    if (!config['bot_owner_id'].includes(message.author.id)) return logger.warn("The command was executed by someone other than the bot owner.");
    if (config['use_button']) {
      const button = new disbtn.MessageButton()
        .setID("verify_ja")
        .setStyle("green")
        .setLabel("Verify");
      message.channel.send({embed: {
        title: "About Verification",
        description: "Press the button below and an hCaptcha link for authentication will be sent to the DM.\nIf you do not receive the DM, please set the setting in the image below to 'ON'.\n(The site you received by DM may display 'deceptive site', but the site is safe, so select 'Details'-> 'visit this unsafe site'.)",
        image: {
          url: "https://media.discordapp.net/attachments/815719965221978117/862842844582772757/unknown.png"
        },
        color: 0x00ff00
      }, buttons: [button]});
    } else {
      const msg = await message.channel.send({embed: {
        title: "About Verification",
        description: "Press the ✅ below and an hCaptcha link for authentication will be sent to the DM.\nIf you do not receive the DM, please set the setting in the image below to 'ON'.\n(The site you received by DM may display 'deceptive site', but the site is safe, so select 'Details'-> 'visit this unsafe site'.)",
        image: {
          url: "https://media.discordapp.net/attachments/815719965221978117/862842844582772757/unknown.png"
        },
        color: 0x00ff00
      }});
      msg.react("✅");
    }
  }
});
client.on('clickButton', async button => {
  await button.think(true);
  if (button.id === "verify_ja") {
    const linkID = pool.createLink(button.clicker.user.id);
    const embed = new discord.MessageEmbed()
      .setTitle('Verification System')
      .setDescription(`Please visit the following link within 15 minutes to verification.\nhttps://${config['domain']}/verify/${linkID}`)
      .setColor('BLUE');
    button.clicker.user.send(embed).then(() => {
    button.reply.edit("I sent it to DM.")
    logger.pending("I sent a link to DM. Waiting for Verification.")
    })
    .catch(async () => {
      logger.error(`I cannot send a dm to ${button.clicker.user.tag}!`);
      button.reply.edit(`I couldn't send a message to <@!${button.clicker.user.id}>. Instead there is a link here.\nhttps://${config['domain']}/verify/${linkID}`)
      return;
    })
  }
});
client.on('messageReactionAdd', async (reaction,  user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.author != client.user) return;
  if (reaction.emoji.name != "✅") return;
  if (!reaction.message.embeds[0] || !reaction.message.embeds[0].description.match(/sent/)) return;
  if (user.bot) return;
  await reaction.users.remove(user);
  const linkID = pool.createLink(user.id);
  const embed = new discord.MessageEmbed()
    .setTitle('Verification System')
    .setDescription(`Please visit the following link within 15 minutes to verification.\nhttps://${config['domain']}/verify/${linkID}`)
    .setColor('BLUE');
  user.send(embed).then(async () => {
    const msg = await reaction.message.channel.send("I sent it to DM.");
    logger.pending("I sent a link to DM. Waiting for Verification.")
    msg.delete({ timeout: 3000 });
  })
  .catch(async () => {
    logger.error(`I cannot send a dm to ${user.tag}!`);
    const msg = reaction.message.channel.send(`I couldn't send a message to <@!${user.id}>. Instead there is a link here.\nhttps://${config['domain']}/verify/${linkID}`);
    msg.delete({ timeout: 10000 });
  });
});

//Web Page
app.get("/verify/:verifyId?", (req, res) => {
  if (!req.params.verifyId) return res.render("invalidLink", {});
  if (!pool.isValidLink(req.params.verifyId)) return res.render("invalidLink", {});
  res.render("verify", { siteKey: process.env['site_key']});
});
app.post("/verify/:verifyId?", async (req, res) => {
  if (!req.body || !req.body['h-captcha-response']) return res.render("invalidLink", {});
  let data = await fetch("https://hcaptcha.com/siteverify", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `response=${req.body['h-captcha-response']}&secret=${process.env['secret_key']}`
  });
  data = await data.json();
  if (!data.success) return res.render("invalidCaptcha", {});
  if (!pool.isValidLink(req.params.verifyId)) return res.render("invalidLink", {});
  try {
    const guild = await client.guilds.cache.get(config['guild_id']);
    const member = guild.member(pool.getDiscordId(req.params.verifyId));
    const roles = config['role_id'];
    for (let roleid of roles) {
      member.roles.add(roleid);
      await sleep(1000);
    }
    logger.success(`Granted a role to ${member.user.tag}.`);
    member.send("Verification Complete!")
    res.render("valid")
  } catch(err) {
    logger.error(`I cannot grant a role to ${pool.getDiscordId(req.params.verifyId)}! Reason: ${err}`);
  }
});


app.listen(80, () => logger.success("Server Started"))
client.login(process.env['token'])
.then(() => logger.pending("Logged in..."))
.catch(() => logger.fatal("Login error!"));

app.use(function(req, res, next){
  res.status(404);
  res.render("notfound", {});
});
