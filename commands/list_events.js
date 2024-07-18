const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const eventModel = require("../schemas/event_schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-events")
    .setDescription("List's all events."),

  async execute(interaction) {
    let roleId = process.env.D_ROLE_EC_ID;
    let roleIdLE = process.env.D_ROLE_ECLE_ID;
    
    if ( // Checks for valid roles
      !interaction.member.roles.cache.has(roleId) && 
      !interaction.member.roles.cache.has(roleIdLE)
    ) {
      interaction.reply({ //If they don't have the valid roles, deny the command.
        content: "You do not have the permission to run this command.",
        ephemeral: true,
      });
      return;
    }

    try {
      let eventList = await eventModel.find(); //Find all the events.

      let embed = new EmbedBuilder()
        .setTitle("List of Events")
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers - 3dsam1`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        })
        .setColor("#3D408F");

      if (eventList.length > 8) {// If there is more than 8 events in the list, we will only show the first 8.
        eventList = eventList.slice(0, 8);
      }

      for (const event in eventList) {
        embed.addFields(
          { name: `\u200b`, value: `**__${eventList[event].event_name}__**` },
          { name: `ID`, value: `${eventList[event].event_id}`, inline: false }
        );

        if (eventList[event].event_status == "Active") {
          embed.addFields({
            name: `\u200b`,
            value: `Began <t:${parseInt(eventList[event].last_time / 1000)}:R>`,
          });
        } else if (eventList[event].event_status == "Finished") {
          embed.addFields({
            name: `\u200b`,
            value: `Ended <t:${parseInt(eventList[event].last_time / 1000)}:R>`,
          });
        }
      }

      interaction.reply({ embeds: [embed] });
    } catch (err) { //Error handling
      console.log(err);
    }
  },
};
