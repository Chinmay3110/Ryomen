const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kiss",
  description: "Kiss someone",
  category: "Image",
  cooldown: 3,

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

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ You can't kiss yourself."),
        ],
      });
    }

    const gifs = [
      "https://nekos.best/api/v2/kiss"
    ];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`💋 ${message.author} kisses ${user}`)
      .setImage("https://c.tenor.com/I8kWjuAtX-QAAAAC/anime-ano.gif")
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
