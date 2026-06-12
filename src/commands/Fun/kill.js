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

    let image = null;

    const apis = [
      {
        url: "https://api.otakugifs.xyz/gif?reaction=slap",
        parser: (data) => data?.url,
      },
      {
        url: "https://nekos.best/api/v2/slap",
        parser: (data) => data?.results?.[0]?.url,
      },
      {
        url: "https://api.waifu.pics/sfw/slap",
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
          `[KILL] ${api.url} failed:`,
          err.code || err.message
        );
      }
    }

    if (!image) {
      image =
        "https://media.tenor.com/lx2WSGRk8bcAAAAC/anime-slap.gif";
    }

    const messages = [
      `🔪 ${message.author} eliminated ${user}`,
      `💀 ${message.author} sent ${user} to the Shadow Realm`,
      `⚰️ ${message.author} deleted ${user}`,
      `🗡️ ${message.author} assassinated ${user}`,
      `☠️ ${message.author} finished off ${user}`,
    ];

    const text =
      messages[Math.floor(Math.random() * messages.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(text)
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
