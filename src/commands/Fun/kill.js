const { EmbedBuilder } = require("discord.js");

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

    const images = [
      "https://i.imgur.com/8Km9tLL.gif",
      "https://i.imgur.com/F6N0z.gif",
      "https://i.imgur.com/yXOvdOS.gif",
    ];

    const image = images[Math.floor(Math.random() * images.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`🔪 ${message.author} killed ${user}`)
      .setImage(image)
      .setTimestamp();

    return message.channel.send({
      content: image,
      embeds: [embed],
    }).catch(() => null);
  },
};
