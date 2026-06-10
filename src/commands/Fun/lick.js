const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "lick",
  category: "Fun",
  aliases: ["lick"],
  cooldown: 3,
  description: "Lick someone",
  args: true,
  usage: "<user>",
  owner: false,
  execute: async (message, args, client, prefix) => {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Please mention a user to lick.`),
        ],
      }).catch(() => null);
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`You can't lick yourself.`),
        ],
      }).catch(() => null);
    }

    try {
      const response = await axios.get("https://api.waifu.pics/sfw/lick", {
        timeout: 10000,
      });

      const image = response?.data?.url;
      if (!image) throw new Error("No image returned from waifu.pics");

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${message.author} Licks ${user}`)
        .setImage(image)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] }).catch(() => null);
    } catch (err) {
      console.error("waifu.pics API error:", err.code || err.message);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ Anime image API is not reachable right now. Please try again later."),
        ],
      }).catch(() => null);
    }
  },
};
