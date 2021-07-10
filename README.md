↓↓↓日本語は下にあるよ↓↓↓

[![Run on Repl.it](https://replit.com/badge/github/nates/ward)](https://replit.com/@waki285/gatekeeper)

# English

## 🔐 A Discord Verification Bot

### overview
This is an verification bot that is easy to configure using [hCaptcha](https://www.hcaptcha.com/) and has strong protection.

This repository is inspired of [nates](https://github.com/nates)/[ward](https://github.com/nates/ward)!
Thanks for nate!

### 🔌 Requirements
* Node.js(Version 12.x or later)
* npm(or yarn)
* Execution environment(I used replit)
* expectations :D

### 📲 Install
```bash
npm install
```
or...
```bash
yarn install
```

### 🖍️ Setup
Rest assured ... these are really easy!

0. Bot Create

  Let's finish these

1. Bot Priviliged Intents

  ![Privileged Intents image](https://camo.githubusercontent.com/044463942dc5f9ffb95c76b923ed1b63710ab4503cb89337fd319716549264f2/68747470733a2f2f692e696d6775722e636f6d2f443266444d6a452e706e67)

  Please **turn on both settings** for this image.

1. Bot configure

    1. Put your Discord Bot's Super Secret Dynamic Token in `.env`!
      ```env
      token=YOUR_SUPER_SECRET_TOKEN
      ```
      or replit...  
      ![Replit env image](https://media.discordapp.net/attachments/815719965221978117/862851865828917248/unknown.png)

    1. Let's change the contents of `config.json`.  
      (The first line that says `memo` is a comment.)
      * domain  
        * The domain used for your verification  
      (Use [https://{Your domain}/verify/{verification id}](#))
      * guild_id
        * The ID of the server that uses this verification bot.
      * role_id
        * An array of role IDs given when verified.
      * use_button
        * Whether to use the MessageComponent (MessageButton) when verificating. If you encounter a problem on Discord such as the button cannot be seen and you want to switch to verification by reaction, set this to `false`.
      * bot_owner_id
        * An array of IDs of people who can place this bot's verification panel. If anyone else sends a panel command, a warning will be displayed in the log.
      * use_japanese
        * If the member uses English, set it to `false`.
    
    1. Get the hCaptcha site key and secret key with [here](https://www.hcaptcha.com).

      Once you have the coolest site key and secret key, put them in your `.env`.
      ```env
      site_key=YOUR_SITE_KEY
      secret_key=YOUR_SUPER_SECRET_KEY
      ```

      or replit...  
      ![replit_env_sitekey_image](https://media.discordapp.net/attachments/824067194396737557/862859475638419476/unknown.png)
      ![replit_env_secretkey_image](https://media.discordapp.net/attachments/824067194396737557/862859717210013706/unknown.png)
  
  Complete! FOOOOOO!   
  Now let's start the bot! Then the bot should be online!
1. Verification Panel
  Run `!verify` on the channel where you want to wake up the verification panel...
  ![panel](https://media.discordapp.net/attachments/815719965221978117/862863285455945758/unknown.png)

  (If you don't see the panel, go to the troubleshooting section)

### 🔫 troubleshooting
* The panel does not appear when I send `!verify`
  * Calm down and make sure your bot has `VIEW_CHANNEL`,` SEND_MESSAGES`, `EMBED_LINKS`, and` READ_MESSAGE_HISTORY` permissions on that channel!
  * Check for typos. I often see `!verifi`,`1verify`, `"verify` and so on.
  * Have you changed the bot prefix?
  * Did you mean that you changed the bot prefix, but you changed the `japanese.js` file and it wasn't reflected in `english.js`?
* 'Verify' button is not displayed (panel is displayed)
  * It may be a Discord bug. Set `use_button` in `config.json` to `false`, then run `!verify` again to make it a reaction.
* `Logged in...` is displayed in the Console, but `Logged in as 〇〇!` Is not displayed.
  * Check again to make sure the token is correct.
  * There is a possibility of Discord rate limiting. Try again in an hour.

* At the verification webpage, `hCaptcha has failed to initialize. Please see the developer tools console for more information.`
  * Make sure the hCaptcha site key and secret key are set correctly.
* When I press the 'Vefify' button, the Console says 'Type Error: Cannot read property 'id'  of null' and Bot is thinking forever on Discord.
  * Is both 'Privileged Intents' turned on in the Developer Portal? If it is off, turn it on.
* Verification is complete and the web page says 'Verified!', But no role has been granted and the Console shows `Missing Permissions` or` Missing Access`.
  * Make sure the bot has `MANAGE_ROLES` permissions and the Verified role is below the bot's top role.
  * Make sure the role ID and server ID are correct.

_ If the problem persists, please let us know in [Issues](https://github.com/waki285/gatekeeper/issues) or [pull requests](https//github.com/waki285/gatekeeper/pulls)! _

# 日本語
## 🔐 Discord認証Bot

### 概要
これは[hCaptcha](https://www.hcaptcha.com/)を使用したDiscordでの認証Botです。

このリポジトリは[nates](https://github.com/nates)/[ward](https://github.com/nates/ward)に影響されています!
nateさんありがとう!

### 🔌 必要条件
* Node.js(バージョン12.x以降)
* npm(または yarn)
* 開発環境(私はreplitを使用しています)
* 完成したものへの期待()

### 📲 Install
```bash
npm install
```
もしくは
```bash
yarn install
```

### 🖍️ セットアップ
心配しないでね！かんたんだよ！

0. ボットアカウント作成

  Qiitaの記事とか見て終わらせてね

1. 特権インテント

  ![Privileged Intents image](https://camo.githubusercontent.com/044463942dc5f9ffb95c76b923ed1b63710ab4503cb89337fd319716549264f2/68747470733a2f2f692e696d6775722e636f6d2f443266444d6a452e706e67)

  この画像の**すべて(2つ)**の設定をONにしてね。

1. Bot設定

    1. あなたの超スーパーシークレットトークンを`.env`に入れてね!
      ```env
      token=とーくん
      ```
      Replitなら...  
      ![Replit env image](https://media.discordapp.net/attachments/815719965221978117/862851865828917248/unknown.png)

    1. `config.json`の中身を変えよう！  
      (最初に「memo」って書いてあるものはコメントです。)
      * domain  
        * 認証に使用するドメイン。  
      ([https://{あなたのドメイン}/verify/{認証用ID}](#)のようになります)
      * guild_id
        * 認証Botを使用するサーバーのID。
      * role_id
        * 認証が完了したときに付与されるロールIDの配列。
      * use_button
        * 認証URLを発行するときにメッセージコンポーネント(ボタン)を使用するかどうか。これを`false`にすると、リアクションを使用するようになります。
      * bot_owner_id
        * 認証パネルを作れる人のIDの配列。
      * use_japanese
        * 日本語を使用するサーバーでは`true`にしてください。
    
    1. [ここ](https://www.hcaptcha.com)でhCaptchaのサイトキーと超スーパーシークレットキーを入手してください。

      入手できたら、`.env`にそれを入れてください。
      ```env
      site_key=サイトキー
      secret_key=超スーパーシークレットキー
      ```

      Replitなら...  
      ![replit_env_sitekey_image](https://media.discordapp.net/attachments/824067194396737557/862859475638419476/unknown.png)
      ![replit_env_secretkey_image](https://media.discordapp.net/attachments/824067194396737557/862859717210013706/unknown.png)
  
  終了! FOOOOOO!   
  Botを動かしてみましょう！オンラインになるはずです！
1. 認証パネル
  `!verify`を送信してみましょう！認証パネルが出てくると思います！
  ![panel](https://media.discordapp.net/attachments/815719965221978117/862863285455945758/unknown.png)

  (もし認証パネルが出てこない場合、トラブルシューティングセクションに写ってください。)

### 🔫 トラブルシューティング
* `!verify`を打っても認証パネルが出てこない
  * まず落ち着いて、Botに`チャンネルを見る`、`メッセージを送信`、`埋め込みリンク`と`メッセージの履歴を見る`権限がこのチャンネルで許可されてることを確認してね!
  * 打ち間違いしてない?`!verifi`とか、`1verify`、`"verify`とかね。
  * Botのプレフィックス変えてない?
  * プレフィックスを変更したつもりが、`english.js`だけ変更してて、`japanese.js`変更してないとかない?
* パネルは出てくるけど、「認証」ボタンが出てこない
  * たぶんこれDiscordのバグだから、`config.json`の`use_button`を`false`にして、もう一度`!verify`してリアクション認証にしてみて！
* `ログイン中...`ってコンソールに出るけど、`〇〇でログイン完了!`と出ない
  * トークンがあってるか確認してみて！
  * Discordのレートリミットの可能性があるから、1時間後に試してみて！

* 認証のウェブページで`hCaptcha has failed to initialize. Please see the developer tools console for more information.`と出る
  * hCaptchaのサイトキーとシークレットキーがあっているか確認してみて！
* 「認証」ボタンを押したら、discord上では永遠に「考え中...」と出て、コンソール上では「Cannot read property 'id' of null」と出ている
  * 'Privileged Intents'オンにした?
* 認証ページで「認証しました！」と出たけど、ロールが付与されておらず、コンソールに`Missing Permissions`か`Missing Access`と出ている
  * Botに`ロールの管理`権限があって、認証ロールがBotの一番上のロールより下であることを確認してね！
  * ロールIDとサーバーIDがあっているか確認してね！

_ これ以外の問題が起きたら、[Issues](https://github.com/waki285/gatekeeper/issues) か [pull requests](https//github.com/waki285/gatekeeper/pulls)を気軽に立ててね! _
