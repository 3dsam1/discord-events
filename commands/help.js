const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder() //Initalizes the help command
    .setName("help")
    .setDescription("Provides the user with some information"),
  async execute(interaction) {

    try {
      const Page1 = new EmbedBuilder() // First page of the help command.

        .setTitle("EdgeGamers Discord Event Status")
        .setDescription(
          `This bot is designed to allow the EC's who host events to be able to much easily keep track of players!
                The bot will automatically track discord events when they go live, and stop tracking when you end them!\n\n
                **Command List**\n
                \`/help\`: Pulls up this menu!\n
                \`/get-status\`: Will show the names of players who connected, along with the time (HH:MM).\n
                \`/list-events\`: Will pull up a list of all events that are currently logged.\n
                \`/clear-event\`: EC Manager Only - Clear's an event from the list.\n
                \`/ping\`: Pong! Checks the bot's response time! \n

                **Support**
                If you have any issues with this bot, please contact eGO Tech Team for support.\n Otherwise, please make a bug report with any bugs!\n
                `
        )
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        })
        .setColor("#3D408F");

      const sent = await interaction.reply({ embeds: [Page1] }); // Sends the help command.
    } catch (err) { // Error handling
     console.log(err);
    }
  },
};
