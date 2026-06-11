const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kill",
  aliases: ["murder"],
  category: "Fun",
  cooldown: 3,
  description: "Kill someone",
  args: true,
  usage: "<user>",

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ Please mention a user to kill."),
        ],
      });
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("❌ You can't kill yourself."),
        ],
      });
    }

    const gifs = [
      "https://i.imgur.com/8Km9tLL.gif",
      "https://i.imgur.com/2X6nR9K.gif",
      "https://i.imgur.com/B5QJ8zH.gif",
      "https://i.imgur.com/W9WJ4Yk.gif"
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`🔪 ${message.author} killed ${user}`)
      .setImage(gif)
      .setTimestamp();

    return message.channel.send({
      embeds: [embed],
    });
  },
};
