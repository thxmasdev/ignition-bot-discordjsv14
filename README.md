<p>
    <img src="https://i.imgur.com/LGH81EP.jpeg" height="240"/> 
</p>

# Ignition Bot

A Discord bot built with Node.js and `discord.js` for managing temporary announcements and moderation. It features slash commands for creating temporary announcements.

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
    "token": "The bot's token from the Discord Developer Portal.",
    "clientId": "The bot's client ID for registering slash commands.",
    "guildId": "The ID of the Discord server where the bot will operate."
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
- `/tempannounce <message> <duration>`: Creates a temporary announcement that deletes itself after the specified duration.
- `/embedtempannounce <title> <description> <duration>`: Creates a temporary announcement with an embed that deletes itself after the specified duration.
- `/ban <user> <reason>`: Bans a user from the server.
- `/kick <user> <reason>`: Kicks a user from the server.
- `/purge <amount> [user]`: Deletes a specified number of messages in the current channel. If a user is specified, deletes messages only from that user.
- `/unban <userid> <reason>`: Unbans a user from the server.
- `/help` & `/botinfo`: Shows basic information about the bot.

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
