const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const mongoose = require("mongoose");
const userModel = require("./schemas/user_schema");
const eventModel = require("./schemas/event_schema");

const token = process.env.D_TOKEN;

const client = new Client({
  // Initiates a new client with the specified intents.
  intents: [
    GatewayIntentBits.Guilds, // Gets guilds
    GatewayIntentBits.GuildMessages, // Reads messages
    GatewayIntentBits.MessageContent, // Reads the content of messages.
    GatewayIntentBits.GuildScheduledEvents, // Gets the scheduled events
    GatewayIntentBits.GuildVoiceStates, // Gets user voice updates
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${command}, is missing a required "data" or "execute" property.`
    );
  }
}

client.once(Events.ClientReady, async (client) => {
  // Once bot is live.

  console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Checks for if its a slash command.

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    // If we can't find the command.

    console.error(
      `[WARNING] No command matching ${interaction.commandName} was found.`
    );
    interaction.reply(
      "This command is no longer supported. If you feel this shouldn't be the case, please contact support"
    );

    return;
  }

  await command.execute(interaction);
});

client.on(Events.GuildScheduledEventUpdate, async (event) => {
  let newEvent = await event.guild.scheduledEvents.fetch(event.id);

  if(!newEvent){
    console.log("Event not found in DB. \n ID: " + event.id);
    return;
  }
  if (event.status == 1 && newEvent.status == 2) {
    // Event starts

    const newEvent = await eventModel.create({
      event_id: event.id,
      guild_id: event.guildId,
      channel_id: event.channelId,
      owner_id: event.createrId,
      event_name: event.name,
      event_status: "Active",
      last_time: Date.now(),
    });

    newEvent.save().catch(console.error());
  } else if (event.status == 2 && newEvent.status == 3) {
    // Event Ends

    let discordEvent = await eventModel.findOne({ event_id: event.id });

    discordEvent.event_status = "Finished";
    discordEvent.last_time = Date.now();
    discordEvent.save().catch(console.error());
  } else {
    // Event is deleted, some bug happens

    eventModel.deleteOne({ event_id: event.id });
    return;
  }
});

client.on(Events.VoiceStateUpdate, async (oldMember, newMember) => {
  let discordId = newMember.id;
  let connectedTime = 0;
  let leaveTime = -1;
  let timeConnected = 0;

  const joinEvent = await eventModel.findOne({
    channel_id: newMember.channelId,
    event_status: "Active",
  }); // If the channel they joined has an event.
  
  const leaveEvent = await eventModel.findOne({
    channel_id: oldMember.channelId,
    event_status: "Active",
  }); // If the channel they left was an event.

  if (joinEvent && joinEvent.event_status == "Active") {
    // If the channel they joined

    const eventId = joinEvent.event_id; // Get's the event ID that is running.

    let checkMember = await userModel.findOne({
      discord_id: discordId,
      event_id: eventId,
    }); // Looks to see if the member is already been added to the event.

    if (!checkMember) {
      // If they haven't been added, we add them.

      connectedTime = Date.now();

      let profile = await userModel.create({
        // Create the user in DB.
        discord_id: `${discordId}`,
        connected_time: `${connectedTime}`,
        time_connected: `${timeConnected}`,
        event_id: `${eventId}`,
      });

      await profile.save().catch(console.error); // Saves the profile.
    } else {
      // If they have already been added.

      connectedTime = Date.now();

      await checkMember.updateOne({ connected_time: connectedTime }); // Sets the join time.
      await checkMember.save().catch(console.error); // Saves the profile.
    }
  }

  if (leaveEvent && leaveEvent.event_status == "Active") {
    // if the channel they left was an event.

    let eventId = leaveEvent.event_id; // gets the event id of the event they left.

    let checkMember = await userModel.findOne({
      discord_id: discordId,
      event_id: eventId,
    }); // Gets the user from the DB.

    if (!checkMember) {
      console.log(
        `Member ${discordId} was not found in DB. Left event: ${eventId}`
      );
      return;
    }

    // Resets the join time and adds to their total connected time.

    connectedTime = parseInt(checkMember.connected_time);

    leaveTime = Date.now();
    timeConnected = parseInt(checkMember.time_connected);
    timeConnected += leaveTime - connectedTime;

    await checkMember.updateOne({
      // Updates the user in DB.
      connected_time: 0,
      time_connected: timeConnected,
    });

    await checkMember.save().catch(console.error); // Saves user in DB.
  }
});

client.login(token);

const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbName = process.env.MONGO_INITDB_DATABASE;

const url = `mongodb://${username}:${password}@mongo:27017/${dbName}?authSource=admin`;

mongoose.connect(url, { useNewUrlParser: true });

mongoose.connection.on("connected", async (connection) => {
  console.log("[MONGO] Succesfully connected to Database.");
});

mongoose.connection.on("disconnect", async () => {
  console.log(`[MONGO] - [WARNING] Disconnected from Database.`);
});
