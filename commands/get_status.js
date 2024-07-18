const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const eventModel = require("../schemas/event_schema");
const userModel = require("../schemas/user_schema");

module.exports = { 
  data: new SlashCommandBuilder()   // Initializes slash command for discord.
    .setName("get-status")
    .setDescription("Gets an event's status.")
    .addStringOption((option) =>
      option
      .setName("id")
      .setDescription("The ID of the event")
    ),

  async execute(interaction) {
    let over25 = false; 
    let embedArray = [];

    let roleId = process.env.D_ROLE_EC_ID;
    let roleIdLE = process.env.D_ROLE_ECLE_ID;

    if ( //Checks if the user has the required roles, and if not, deny the command.
      !interaction.member.roles.cache.has(roleId) &&
      !interaction.member.roles.cache.has(roleIdLE)
    ) {
      interaction.reply({
        content: "You do not have the permission to run this command.",
        ephemeral: true,
      });
      return;
    }

    try {
      let eventId;

      if (!interaction.options.getString("id")) { // Checks to see if the user didn't provide a string.
        let eventList = await eventModel.find({ event_status: "Active" }); // Checks if there is already an "active" event.

        if (eventList.length > 1) { //If there is more than 1 current active event we need an ID.
          interaction.reply(
            "There is more than one active event. Please try again with a valid ID."
          );
          return;
        } else if (eventList.length < 1) { //If there is no active event, request an ID.
          interaction.reply(
            "There is no active event. Please try again with a valid ID."
          );
          return;
        } else { // If there is only one active event, we can use that and grab the event ID from there.
          eventId = eventList[0].event_id;
        }
      } 
      else { // Get the id from the user if they provided one.
        eventId = interaction.options.getString("id");
      }

      let attendence = await userModel.find({ event_id: eventId }); // Find the event
      let attendence2;
      let event = await eventModel.findOne({ event_id: eventId });

      if (!event) { // If there is no event
        interaction.reply({
          content: `That event was not found. Please try again.`,
          ephemeral: true,
        });
        return;
      }

      if (!attendence) { // If there is no one attending the event
        interaction.reply({
          content: `No individual attended this event. If this is a mistake please contact support`,
          ephemeral: true,
        });
        console.log(`Event ${eventId} was found but had no attendees`); // Logs if there is an event with no attendence [This shouldn't happen so we want to know if it does]
        return;
      }

      let sheetArray = [];

      let attendenceEmbed1 = new EmbedBuilder() // First attendence embed.
        .setTitle(`Attendence for event '${event.event_name}'`)
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers - 3dsam1`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        })
        .setColor("#3D408F");

      if (attendence.length > 25) { // If the amount of users who attended the event is more than 25
        attendence2 = attendence.slice(25, 50); // Split into two seperate arrays
        attendence = attendence.slice(0, 25); // Cut off at 50.
        over25 = true; 
      }

      for (const player in attendence) { // Formats each user into one embed. 
        let user = await interaction.guild.members.fetch(
          attendence[player].discord_id
        );

        let userTime = parseInt(attendence[player].time_connected / 1000);

        let userTimeSec = userTime % 60;
        parseInt((userTime /= 60));

        let userTimeMin = parseInt(userTime % 60);
        parseInt((userTime /= 60));

        let userTimeHr = parseInt(userTime);

        let formattedString = `${userTimeHr}:${userTimeMin}:${userTimeSec}`;
        attendenceEmbed1.addFields({
          name: `\u200b`,
          value: `<@${attendence[player].discord_id}> ${formattedString}`,
          inline: false,
        });

        sheetArray.push(`${user.displayName}`);
      }

      embedArray.push(attendenceEmbed1);

      if (over25) { // If there is more than 25 people, we start a new embed.
        let attendenceEmbed2 = new EmbedBuilder()
          .setTitle(`Attendence for event '${event.event_name}'`)
          .setTimestamp()
          .setFooter({
            text: `EdgeGamers - 3dsam1`,
            iconURL: "https://i.imgur.com/N4IRIbH.gif",
          })
          .setColor("#3D408F");

        for (const player in attendence2) {
          let user = await interaction.guild.members.fetch(
            attendence2[player].discord_id
          );

          let userTime = parseInt(attendence2[player].time_connected / 1000);

          let userTimeSec = userTime % 60;
          parseInt((userTime /= 60));

          let userTimeMin = parseInt(userTime % 60);
          parseInt((userTime /= 60));

          let userTimeHr = parseInt(userTime);

          let formattedString = `${userTimeHr}:${userTimeMin}:${userTimeSec}`;
          attendenceEmbed2.addFields({
            name: `\u200b`,
            value: `<@${attendence2[player].discord_id}> ${formattedString}`,
            inline: false,
          });

          sheetArray.push(`${user.displayName}`);
        }
        embedArray.push(attendenceEmbed2);
      }

      let sheetEmbed = new EmbedBuilder()
        .setTitle("Sheet formatted attendence for event ", event.event_name)
        .setTimestamp()
        .setFooter({
          text: `EdgeGamers`,
          iconURL: "https://i.imgur.com/N4IRIbH.gif",
        });

      if (event.event_status == "Active") {
        attendenceEmbed1.setColor("Green");
        sheetEmbed.setColor("Green");
      } else if (event.event_status == "Finished") {
        attendenceEmbed1.setColor("Red");
        sheetEmbed.setColor("Red");
      } else {
        sheetEmbed.setColor("Blurple");
      }

      let sheetString = sheetArray.join(", "); //Adds all users in the format we need for google sheets.

      sheetEmbed.setDescription(sheetString);

      embedArray.push(sheetEmbed);

      interaction.reply({ embeds: embedArray });
    } catch (err) {// Error handling
      console.log(err); 
    }
  },
};
