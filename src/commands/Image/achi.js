const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "achi",
  aliases: ["achievement"],
  category: "Image",
  cooldown: 3,
  description: "Generate a Minecraft achievement",
  args: true,
  usage: "<text>",
  owner: false,

  execute: async (message, args, client) => {
    const text = args.join(" ");

    if (!text) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ Please provide achievement text."),
        ],
      }).catch(() => null);
    }

    const achievementUrl = `https://minecraftskinstealer.com/achievement/12/Achievement%20Get!/${encodeURIComponent(text)}`;

    const embed = new EmbedBuilder()
      .setTitle("🏆 Minecraft Achievement!")
      .setColor(client.color)
      .setImage(achievementUrl)
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return message.channel.send({
      embeds: [embed],
    }).catch(() => null);
  },
};
