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
      "https://media.tenor.com/QM6bncK9nXQAAAAC/anime-kill.gif",
      "https://media.tenor.com/2roX3uxz_68AAAAC/anime-sword.gif",
      "https://media.tenor.com/y0A6fHq7V7gAAAAC/anime-fight.gif"
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color || "#ff0000")
      .setTitle("💀 Kill")
      .setDescription(`🔪 **${message.author.username}** killed **${user.username}**`)
      .setImage(gif)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
