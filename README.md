# Discord Event Bot

## Name

EdgeGamers Discord Event Status Bot

## Description

This discord bot was created in order to simplify the logging process of events that occured on Discord. It works by checking for when a Discord Event goes live. When it does, it will start tracking the event, and logging any user who joins, keeping track of how long they joined for, which event they joined, and when they left. It then will allow you to pull a list of all individuals who attended an event, giving you the name, ID and time. Additionally, it allows you to keep the event status for as long as you need, clearing it when you want to.

## Environment File

`D_TOKEN`: The Discord Bot token, provided by discord.

`D_Client_ID`: The Discord ID of the bot.

`D_ROLE_EC_ID`: The Event Cooridinator Role. This role has access to list events, and pull the status.

`D_ROLE_ECLE_ID`: The Event Cooridinator Leadership Role. This role has access to all things the Event Cooridinators does, as well as the ability to clear events.

`MONGO_INITDB_DATABASE`: The Database name to be used by Mongo.

`MONGO_INITDB_ROOT_USERNAME`: The Database Root User username.

`MONGO_INITDB_ROOT_PASSWORD`: The Database root user password.

## Discord Permissions

The bot does not need any special permisions. All it needs is access to view the channels and to send messages as replies.

| Administrator   | ❌  | Manage Nicknames     | ❌  | Mention Everyone    | ❌  |
| --------------- | --- | -------------------- | --- | ------------------- | --- |
| Audit Log       | ❌  | Manage Emojis        | ❌  | Use External Emojis | ❌  |
| Server Insights | ❌  | Manage Webhooks      | ❌  | Add Reactions       | ❌  |
| Manage Server   | ❌  | View Channels        | ✔️  | Mute Members        | ❌  |
| Manage Roles    | ❌  | Send Messages        | ✔️  | Deafen Members      | ❌  |
| Manage Channels | ❌  | Send TTS Messages    | ❌  | Move Members        | ❌  |
| Kick Members    | ❌  | Manage Messages      | ❌  | Use Voice Activity  | ❌  |
| Ban Members     | ❌  | Embed Links          | ❌  | Priority Speaker    | ❌  |
| Create Invite   | ❌  | Attach Files         | ❌  | Connect/Speak/Video | ❌  |
| Change Nickname | ❌  | Read Message History | ❌  | Top Role Required   | ❌  |
