const { EmbedBuilder } = require("discord.js");

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

    const avatar = user.displayAvatarURL({
      extension: "png",
      size: 512,
      forceStatic: true,
    });

    const image = `https://some-random-api.com/canvas/beautiful?avatar=${encodeURIComponent(
      avatar
    )}`;

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`✨ ${user} is beautiful!`)
      .setImage(image)
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
