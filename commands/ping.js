const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder() // Initializes the command with discord
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const client = interaction.client;

    try {
      const exampleEmbed = new EmbedBuilder()
        .setColor("#3D408F")
        .setTitle("Latency :ping_pong:")
        .setDescription("Pinging.. Please wait.")
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        });

      const sent = await interaction.reply({ //Sends the first message and then fetches it.
        embeds: [exampleEmbed],
        fetchReply: true,
      });

      await interaction.fetchReply();

      var ping = sent.createdTimestamp - interaction.createdTimestamp; // Calculates the time it was sent, versus when the user ran the command.

      const finalEmbed = new EmbedBuilder() // Puts all the proper information
        .setColor("#3D408F")
        .setTitle("Latency :ping_pong:")
        .setDescription(`Bot: ${ping} ms\nAPI: ${client.ws.ping} ms`)
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        });

      interaction.editReply({ embeds: [finalEmbed] });
    } catch (err) { // Error handling
      console.log(err);
    }
  },
};
