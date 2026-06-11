const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "kill",
  aliases: ["murder"],
  category: "Fun",
  cooldown: 3,

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user)
      return message.reply("Mention someone to kill.");

    if (user.id === message.author.id)
      return message.reply("You can't kill yourself.");

    try {
      const res = await axios.get("https://api.waifu.pics/sfw/kill");

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`🔪 ${message.author} killed ${user}`)
        .setImage(res.data.url)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.log(err);

      return message.channel.send({
        content: "Failed to fetch GIF."
      });
    }
  },
};
