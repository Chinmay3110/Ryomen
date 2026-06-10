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

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("Please mention a user to lick."),
        ],
      });
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("You can't lick yourself."),
        ],
      });
    }

    try {
      const res = await axios.get(
        "https://nekos.best/api/v2/lick",
        { timeout: 10000 }
      );

      const image = res.data.results[0].url;

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${message.author} licks ${user}`)
        .setImage(image)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error("Lick API Error:", err);

      const fallbackEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${message.author} licks ${user} 😋`)
        .setImage(
          "https://i.imgur.com/4M34hi2.gif"
        );

      return message.channel.send({ embeds: [fallbackEmbed] });
    }
  },
};
