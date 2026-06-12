const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Canvafy } = require("canvafy");

module.exports = {
  name: "beautiful",
  category: "Image",
  aliases: ["beauty"],
  cooldown: 3,
  description: "Make someone beautiful",
  args: false,
  usage: "[user]",
  owner: false,

  execute: async (message, args, client) => {
    const user = message.mentions.users.first() || message.author;

    try {
      const image = await new Canvafy.Beautiful()
        .setAvatar(
          user.displayAvatarURL({
            extension: "png",
            size: 512,
          })
        )
        .build();

      const attachment = new AttachmentBuilder(image, {
        name: "beautiful.png",
      });

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`✨ ${user} is beautiful!`)
        .setImage("attachment://beautiful.png")
        .setFooter({
          text: `Requested by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      return message.channel.send({
        embeds: [embed],
        files: [attachment],
      }).catch(() => null);

    } catch (err) {
      console.log("[BEAUTIFUL]", err);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Failed to generate image."),
        ],
      }).catch(() => null);
    }
  },
};
