const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "hug",
  description: "Hug someone",
  category: "Image",
  cooldown: 3,
  botPermissions: ["SendMessages", "EmbedLinks"],
  userPermissions: [],

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("Please mention a user to hug."),
        ],
      }).catch(() => null);
    }

    if (user.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("You can't hug yourself."),
        ],
      }).catch(() => null);
    }

    let image = null;

    const apis = [
      {
        url: "https://nekos.best/api/v2/hug",
        parser: (data) => data?.results?.[0]?.url,
      },
      {
        url: "https://api.otakugifs.xyz/gif?reaction=hug",
        parser: (data) => data?.url,
      },
      {
        url: "https://api.waifu.pics/sfw/hug",
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
          `[HUG] ${api.url} failed:`,
          err.code || err.message
        );
      }
    }

    if (!image) {
      image =
        "https://media.tenor.com/9e1aE_xB8KAAAAAC/anime-hug.gif";
    }

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`🤗 ${message.author} hugs ${user}`)
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
