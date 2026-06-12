const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kill",
  category: "Fun",
  aliases: ["kill"],
  cooldown: 3,

  execute: async (message, args, client) => {
    const user = message.mentions.users.first();

    if (!user) return message.reply("Mention a user.");
    if (user.id === message.author.id)
      return message.reply("You can't kill yourself.");

    const gifs = [
      "https://i.imgur.com/7l6QG8Y.gif",
      "https://i.imgur.com/6RL6j7D.gif"
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("💀 Kill")
      .setDescription(`🔪 **${message.author.username}** killed **${user.username}**`)
      .setImage(gif);

    await message.channel.send({ embeds: [embed] });
  },
};
