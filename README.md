# Suggestion Bot

A Discord bot built with Node.js and `discord.js` for managing suggestions. It features slash commands for creating suggestions and includes a cooldown system to prevent spam.

## 💻 Technologies Used

<p align="center">
    <img src="https://img.shields.io/badge/-JavaScript-F7DF1C?style=for-the-badge&logo=javascript&logoColor=black" height="40"/>&nbsp;
    <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" height="40"/>&nbsp;
    <img src="https://img.shields.io/badge/-discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white" height="40"/>&nbsp;
</p>

## 🔧 Configuration

Create a `config.json` file in the root directory with the following structure:

```json
{
    "token": "The bot's token from the Discord Developer Portal.",
    "clientId": "The bot's client ID for registering slash commands.",
    "guildId": "The ID of the Discord server where the bot will operate.",
    "channelId": "The ID of the channel where suggestions will be sent."
}
```

## 🛠️ Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/thxmasdev/suggestion-bot-discord.js
    cd your-repository
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Start Bot**
    ```bash
    node index.js
    ```

# 📜 How It Works
### Slash Commands
/suggest create <suggestion>: Creates a new suggestion in the specified channel.

### Cooldown System
Users can only submit a suggestion every 30 minutes. If a user tries to submit more frequently, they will be informed of the remaining time to wait.

## 🔗 Connect with Me

<p align="center">
    <a href="https://discord.com/users/thxmasdev"><img src="https://img.shields.io/badge/-thxmasdev-5865F2?style=for-the-badge&logo=Discord&logoColor=white" height="40"/></a>
    <a href="https://twitter.com/thxmasdev"><img src="https://img.shields.io/badge/-thxmasdev-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white" height="40"/></a>
</p>

## 🌐 Join My Discord Server

<p align="center">
    <a href="https://discord.gg/yDqmpM3XtM"><img src="https://img.shields.io/badge/-Join%20My%20Discord%20Server-7289DA?style=for-the-badge&logo=discord&logoColor=white" height="40"/></a>
</p>

## 👤 Creator - Credit

- **Developer:** thxmasdev
