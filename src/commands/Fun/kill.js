const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kill",
  aliases: ["murder"],
  category: "Fun",
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
      "https://c.tenor.com/6a42QlkVsCEAAAAC/anime-sword.gif",
      "https://c.tenor.com/rMVO0K7sM0QAAAAC/anime-fight.gif",
      "https://c.tenor.com/x8v1oNUOmg4AAAAC/anime-fight.gif",
      "https://c.tenor.com/oQnM1l4b7zUAAAAC/anime-attack.gif",
      "https://c.tenor.com/epNMHGvRyHcAAAAC/anime-kill.gif"
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
