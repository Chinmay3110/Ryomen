const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "kiss",
  description: "Kiss someone",
  category: "Image",
  cooldown: 3,
  botPermissions: ["SendMessages", "EmbedLinks"],

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ Please mention a user to kiss."),
        ],
      });
    }

    if (user.bot) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ You can't kiss bots."),
        ],
      });
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ You can't kiss yourself."),
        ],
      });
    }

    try {
      const { data } = await axios.get(
        "https://api.waifu.pics/sfw/kiss"
      );

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`💋 ${message.author} kisses ${user}`)
        .setImage(data.url)
        .setTimestamp();

      return message.channel.send({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Failed to fetch a kiss image."),
        ],
      });
    }
  },
};
