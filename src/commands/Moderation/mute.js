const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mute",
  category: "Moderation",
  aliases: ["stfu"],
  cooldown: 3,
  description: "Mute a user",
  args: false,
  usage: "$mute <mention/userid> [duration] [reason]",
  userPerms: ["ModerateMembers"],
  botPerms: ["ModerateMembers"],
  owner: false,

  execute: async (message, args, client) => {
    const member =
      message.mentions.members.first() ||
      await message.guild.members.fetch(args[0]).catch(() => null);

    if (!member) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setTitle("**__Mute Command__**")
            .addFields(
              { name: "Aliases", value: "`mute | stfu`" },
              { name: "Duration", value: "`10s, 1m, 1h, 1d, 7d, 28d`" },
              { name: "Usage", value: "`$mute <mention/userid> [duration] [reason]`" }
            ),
        ],
      });
    }

    if (!member.moderatable) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | I cannot mute this user.`),
        ],
      });
    }

    if (
      member.roles.highest.position >= message.member.roles.highest.position &&
      message.author.id !== message.guild.ownerId
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | You cannot mute a user with an equal or higher role.`),
        ],
      });
    }

    const durationArg = args[1] || "28d";
    const duration = parseDuration(durationArg);

    if (!duration) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Invalid duration. Use like \`10s\`, \`1m\`, \`1h\`, \`1d\`.`),
        ],
      });
    }

    if (duration < 10 * 1000) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Mute duration must be at least \`10s\`.`),
        ],
      });
    }

    if (duration > 28 * 24 * 60 * 60 * 1000) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Discord timeout max is \`28d\`.`),
        ],
      });
    }

    const reason =
      args.slice(2).join(" ").trim() || "No Reason";

    try {
      await member.timeout(
        duration,
        `${message.author.tag} (${message.author.id}) | ${reason}`
      );

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.tick} | Muted ${member} for **${durationArg}**.`),
        ],
      });
    } catch (error) {
      console.error(error);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Failed to mute ${member}.`),
        ],
      });
    }
  },
};

function parseDuration(str) {
  const regex = /^(\d+)(s|m|h|d)$/i;
  const match = str.match(regex);

  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "s") return value * 1000;
  if (unit === "m") return value * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  if (unit === "d") return value * 24 * 60 * 60 * 1000;

  return null;
}
