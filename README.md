<p>
    <img src="https://i.imgur.com/LGH81EP.jpeg" height="240"/> 
</p>

# Ignition Bot

A Discord bot made with Node.js and 'discord.js v14' to manage scheduled and normal ads in embed and text format, autorole management, moderation system, automatic moderation with blacklisted words and suggestion system.

## 💻 Technologies Used

<p align="center">
    <img src="https://img.shields.io/badge/-JavaScript-F7DF1C?style=for-the-badge&logo=javascript&logoColor=black" height="40"/> 
    <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" height="40"/> 
    <img src="https://img.shields.io/badge/-discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white" height="40"/> 
    <img src="https://img.shields.io/badge/-JSON-000000?style=for-the-badge&logo=json&logoColor=white" height="40"/>&nbsp;
</p>
</p>

## 🔧 Configuration

Create a `config.json` file in the root directory with the following structure:

```json
{
  "token": "TOKEN_BOT",
  "clientId": "BOT_CLIENT_ID",
  "guildId": "DISCORD_SERVER_ID",
  "suggestionsChannelId": "SUGGESTION_CHANNEL_ID",
  "embedFooter": {
    "text": "TEXT_FOOTER",
    "icon_url": "URL_IMAGE"
  }
}
```

## 🛠️ Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/thxmasdev/ignition-bot-discordjsv14
    cd ignition-bot-discordjsv14
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Start Bot**
    ```bash
    node index.js
    ```

# 📜 How It Works
### Slash Commands

#### Moderation Commands
- `/ban <user> <reason>`: Bans a user from the server.
- `/kick <user> <reason>`: Kicks a user from the server.
- `/purge <amount> [user]`: Deletes a specified number of messages in the current channel. If a user is specified, deletes messages only from that user.
- `/unban <userid> <reason>`: Unbans a user from the server.
- `/warn <user> <reason>`: Warn a user.
- `/unwarn <user>`: Remove a warning from a user.
- `/warnlist <user>`: List all warnings for a user.

#### Announcement Commands
- `/tempannounce <channel> <message> <duration>`: Creates a temporary announcement that deletes itself after the specified duration.
- `/embedtempannounce <title> <description> <duration> <embed-color> <footer> <image>`: Creates a temporary announcement with an embed that deletes itself after the specified duration.
- `/announce <channel> <message>`: Create Ad normal.
- `/embedannounce <channel> <title> <description> <embed-color> <footer> <image>`: Create Ad embed normal.

#### Word Management Commands
- `/word-blacklist add <word>`: Adds a word to the blacklist.
- `/word-blacklist remove <word>`: Removes a word from the blacklist.
- `/word-blacklist list`: Lists all words in the word blacklist.

#### Role Commands
- `/autoroles-create <category_name>`: Create a new autorole category.
- `/autoroles-add <category> <role> <emoji>`: Add a role to an autorole category.
- `/autoroles-remove <messageID> <role>`: Remove a role from an autorole category.
- `/autoroles-send <category> <description> <channel> <embeD_color>`: Send an autorole embed.
- `/autoroles-categories / <category>`: Lists all configured reaction roles.

#### Information Commands
- `/help`: Shows basic information about the bot.
- `/botinfo`: Shows detailed information about the bot.

#### Suggestion Commands
- `/suggest <suggestion>`: Submits a suggestion for the server.
- `/suggestion accept <message_id>`: Accept suggestion.
- `/suggestion deny <message_id>`: Deny suggestion.

## 🔗 Connect with Me

<p align="center">
    <a href="https://discord.com/users/thxmasdev"><img src="https://img.shields.io/badge/-thxmasdev-5865F2?style=for-the-badge&logo=Discord&logoColor=white" height="40"/></a>
    <a href="https://twitter.com/thxmasdev"><img src="https://img.shields.io/badge/-thxmasdev-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white" height="40"/></a>
</p>

## 🌐 Join My Discord Server

<p align="center">
    <a href="https://discord.gg/yDqmpM3XtM"><img src="https://img.shields.io/badge/-Join%20My%20Discord%20Server-7289DA?style=for-the-badge&logo=discord&logoColor=white" height="40"/></a>
</p>

## 👤 Creator - Credits

- **Developer:** thxmasdev
