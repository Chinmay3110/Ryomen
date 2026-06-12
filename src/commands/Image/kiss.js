const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "kiss",
  category: "Image",
  aliases: ["kiss"],
  cooldown: 3,
  description: "Kiss someone",
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
            .setDescription("Please mention a user to kiss."),
        ],
      }).catch(() => null);
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("You can't kiss yourself."),
        ],
      }).catch(() => null);
    }

    let image = null;

    const apis = [
      {
        url: "https://nekos.best/api/v2/kiss",
        parser: (data) => data?.results?.[0]?.url,
      },
      {
        url: "https://api.otakugifs.xyz/gif?reaction=kiss",
        parser: (data) => data?.url,
      },
      {
        url: "https://api.waifu.pics/sfw/kiss",
        parser: (data) => data?.url,
      },
    ];

    for (const api of apis) {
      try {
        const res = await axios.get(api.url, {
          timeout: 10000,
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        });

        image = api.parser(res.data);

        if (image) break;
      } catch (err) {
        console.log(
          `[KISS] ${api.url} failed:`,
          err.code || err.message
        );
      }
    }

    if (!image) {
      image =
        "https://media.tenor.com/ErAPuiWY46AAAAAC/anime-kiss.gif";
    }

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`💋 ${message.author} kisses ${user}`)
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
