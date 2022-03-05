"use strict";

//定義

const discord = require("discord.js");
const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ["MESSAGE", "REACTION", "CHANNEL"]});

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

//ウェブページ設定

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views_ja');
app.use(express.static(path.join(__dirname, 'public')));

//Discord
client.on('ready', () => {
  logger.success(`${client.user.tag}でログイン完了！！`);
});
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "verify") {
    if (!config['bot_owner_id'].includes(message.author.id)) return logger.warn("Botのオーナー以外がこのコマンドを実行しました。");
    if (config['use_button']) {
      const button = new discord.MessageButton()
        .setCustomId("verify_ja")
        .setStyle("SUCCESS")
        .setLabel("認証");
      message.channel.send({embeds: [{
        title: "認証について",
        description: "下のボタンを押すと認証のためのhCaptchaリンクがDMに送信されます。\nDMが届かない方は、下画像の設定を「オン」にしてください。\n(DMで届いたサイト先で「安全ではありません」という表示が出ることがありますが、サイトは安全なので、「詳細」→「安全でないこのサイトにアクセス」をお選びください。)",
        image: {
          url: "https://media.discordapp.net/attachments/798922824349646938/860768481245790248/unknown.png"
        },
        color: 0x00ff00
      }], components: [new discord.MessageActionRow().addComponents(button)]});
    } else {
      const msg = await message.channel.send({embeds: [{
        title: "認証について",
        description: "下の✅を押すと認証のためのhCaptchaリンクがDMに送信されます。\nDMが届かない方は、下画像の設定を「オン」にしてください。\n(DMで届いたサイト先で「安全ではありません」という表示が出ることがありますが、サイトは安全なので、「詳細」→「安全でないこのサイトにアクセス」をお選びください。)",
        image: {
          url: "https://media.discordapp.net/attachments/798922824349646938/860768481245790248/unknown.png"
        },
        color: 0x00ff00
      }]});
      msg.react("✅");
    }
  }
});
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === "verify_ja") {
    await interaction.deferReply({ ephemeral: true });
    const linkID = pool.createLink(interaction.user.id);
    const embed = new discord.MessageEmbed()
      .setTitle('認証システム')
      .setDescription(`次のリンクを15分以内に訪れて、認証してください。.\nhttps://${config['domain']}/verify/${linkID}`)
      .setColor('BLUE');
    interaction.user.send({embeds: [embed]}).then(() => {
      interaction.followUp("DMに送信しました。")
      logger.pending("DMにリンクを送信しました。認証を待っています。")
    })
    .catch(async () => {
      logger.error(`${button.clicker.user.tag}にメッセージを送れませんでした！`);
      interaction.followUp(`<@!${button.clicker.user.id}>さんにメッセージを送れませんでした。代わりにここにリンクを表示します。\nhttps://${config['domain']}/verify/${linkID}`)
      return;
    })
  }
});
client.on('messageReactionAdd', async (reaction,  user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.author != client.user) return;
  if (reaction.emoji.name != "✅") return;
  if (!reaction.message.embeds[0] || !reaction.message.embeds[0].description.match(/送信されます/)) return;
  if (user.bot) return;
  await reaction.users.remove(user);
  const linkID = pool.createLink(user.id);
  const embed = new discord.MessageEmbed()
    .setTitle('認証システム')
    .setDescription(`次のリンクを15分以内に訪れて、認証してください。.\nhttps://${config['domain']}/verify/${linkID}`)
    .setColor('BLUE');
  user.send({embeds: [embed]}).then(async () => {
    const msg = await reaction.message.channel.send("DMに送信しました。");
    logger.pending("DMにリンクを送信しました。認証を待っています。")
    msg.delete({ timeout: 3000 });
  })
  .catch(async () => {
    logger.error(`${user.tag}にメッセージを送れませんでした！`);
    const msg = reaction.message.channel.send(`<@!${user.id}>さんにメッセージを送れませんでした。代わりにここにリンクを表示します。\nhttps://${config['domain']}/verify/${linkID}`);
    await sleep(10000)
    msg.delete();
  });
});

//ウェブページ
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
    logger.success(`${member.user.tag}にロールを付与しました。`);
    member.send("認証が完了しました。")
    res.render("valid", {});
  } catch(err) {
    logger.error(`${pool.getDiscordId(req.params.verifyId)}にロールを付与できませんでした！!Reason: ${err}`);
  }
});

if (!process.env['site_key'] || !process.env['secret_key']) {
  logger.fatal("hCaptchaのサイトキー/シークレットがありません！");
  process.exit(1)
}

app.listen(80, () => logger.success("サーバーが稼働しました！"))
client.login(process.env['token'])
.then(() => logger.pending("ログイン中..."))
.catch(() => logger.fatal("ログインにエラーが発生しました！"));
app.use(function(req, res, next){
  res.status(404);
  res.render("notfound", {});
});
