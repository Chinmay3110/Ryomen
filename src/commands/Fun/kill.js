const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kill",
  category: "Fun",
  aliases: ["kill"],
  cooldown: 3,

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user)
      return message.reply("Mention a user.");

    if (user.id === message.author.id)
      return message.reply("You can't kill yourself.");

    const gifs = [
      "https://c.tenor.com/Ug6CbVA1ZsMAAAAd/anime-fight.gif",
      "https://c.tenor.com/8uP8M2p0kQ8AAAAd/anime-sword.gif",
      "https://c.tenor.com/4bY0bJ5n8jQAAAAd/anime-attack.gif",
      "https://c.tenor.com/3zzjM_k8aA4AAAAd/anime-kill.gif"
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`🔪 ${message.author} killed ${user}`)
      .setImage(gif);

    return message.channel.send({ embeds: [embed] });
  },
};
