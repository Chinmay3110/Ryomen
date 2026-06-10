/** @format
 *
 * Arrkiii By Ozuma xd
 * © 2024 Arrkiii Development
 *
 */

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "simprate",
  aliases: ["simp"],
  description: "simp",
  cooldown: 3,
  userPerms: [],
  botPerms: [],
  category: "Fun",
  execute: async (message, args, client, prefix) => {
    const member = message.mentions.members.first() || message.member;
    const username = member?.user?.username || message.author.username;
    const result = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(
        `**${username} Is ${result}% Simp <:simpers_Eyes_AE:1194607509445550161>**`,
      );

    return message.channel.send({ embeds: [embed] }).catch(() => null);
  },
};
