const { SlashCommandBuilder} = require("discord.js");


// MONGO requirements
const eventModel = require("../schemas/event_schema");
const userModel = require("../schemas/user_schema");

module.exports = {

  data: new SlashCommandBuilder() // Initializes the slash command with discord
    .setName("clear-event")
    .setDescription("Clear's a specific event.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the event")
        .setRequired(true)
    ),


  async execute(interaction) {

    let roleIdLE = process.env.D_ROLE_ECLE_ID; 
    if (!interaction.member.roles.cache.has(roleIdLE)) { // Check to see if user has the EC Leadership rol, if they don't, deny the command.
      interaction.reply({ 
        content: "You do not have the permission to run this command.",
        ephemeral: true,
      });

      return;
    }

    try {
      let eventId = interaction.options.getString("id"); // Takes the users input.

      let event = await eventModel.findOne({ event_id: eventId }); // Finds the event based on the ID provided.

      if (!event) { // Checks to see if it is not found (Mongo returns an undefined field if it isn't.)
        interaction.reply("That event does not exist. Please try again.");
        return;
      }

      await userModel.deleteMany({ event_id: eventId }); // Delete all the users for that event
      await eventModel.deleteOne({ event_id: eventId }); // Delete the event from the event list

      interaction.reply({ // Reply to the user
        content: `Event ${eventId} has been cleared.`,
        ephemeral: true,
      });
    } catch (err) { // Error handling
      console.log(err);
    }
  },
};
