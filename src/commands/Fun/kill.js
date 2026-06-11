const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "kill",
  category: "Fun",
  aliases: ["kill"],
  cooldown: 3,
  description: "Kill someone",
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
            .setDescription("Please mention a user to kill."),
        ],
      }).catch(() => null);
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("You can't kill yourself."),
        ],
      }).catch(() => null);
    }

    try {
      const images = [
        "https://media.tenor.com/x8v1oNUOmg4AAAAC/anime-fight.gif",
        "https://media.tenor.com/l6D9i4mP0GQAAAAC/anime-kill.gif",
        "https://media.tenor.com/5nP6j4KJ3w4AAAAC/anime-attack.gif",
        "https://media.tenor.com/e6z8s6BvY7AAAAAC/anime-sword.gif",
      ];

      const image = images[Math.floor(Math.random() * images.length)];

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`🔪 ${message.author} killed ${user}`)
        .setImage(image)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ Something went wrong."),
        ],
      });
    }
  },
};
