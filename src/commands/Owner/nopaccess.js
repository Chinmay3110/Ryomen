const {
  EmbedBuilder,
} = require("discord.js");

const db = require("../../schema/accessnop");

module.exports = {
  name: "nopaccess",
  aliases: ["nopperms", "npp"],
  category: "Owner",
  description: "Manage NoPrefix access users",
  args: false,
  usage: "add/remove/list/clear <user>",
  owner: true,

  execute: async (message, args, client, prefix) => {
    if (message.author.id !== client.config.ownerID) {
  return message.channel.send(
    "___Only bot owner can use this command!___"
  );
}

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `**Usage:**\n\`${prefix}nopaccess add <user>\`\n\`${prefix}nopaccess remove <user>\`\n\`${prefix}nopaccess list\`\n\`${prefix}nopaccess clear\``,
            ),
        ],
      });
    }

    const opt = args[0].toLowerCase();

    if (opt === "add" || opt === "a" || opt === "+") {
      const user =
        message.mentions.users.first() ||
        (args[1] ? await client.users.fetch(args[1]).catch(() => null) : null);

      if (!user) {
        return message.reply({ content: "Provide me a valid user." });
      }

      const npData = await db.findOne({ userId: user.id });

      if (npData) {
        return message.reply({
          content: "This user is already in my NopAccess system.",
        });
      }

      await db.create({
        userId: user.id,
        noprefix: true,
      });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`✅ Now ${user} has NopAccess. Added by ${message.author}.`)
            .setFooter({
              text: "Keep Supporting Us <3",
              iconURL: message.guild?.iconURL() || client.user.displayAvatarURL(),
            }),
        ],
      });
    }

    if (opt === "remove" || opt === "r" || opt === "-") {
      const user =
        message.mentions.users.first() ||
        (args[1] ? await client.users.fetch(args[1]).catch(() => null) : null);

      if (!user) {
        return message.reply({ content: "Provide me a valid user." });
      }

      const npData = await db.findOne({ userId: user.id });

      if (!npData) {
        return message.reply({
          content: "This user is not in my NopAccess system.",
        });
      }

      await db.deleteOne({ userId: user.id });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.tick} Successfully removed ${user} from NopAccess.`),
        ],
      });
    }

    if (opt === "list" || opt === "show") {
      const data = await db.find();

      if (!data.length) {
        return message.reply({ content: "There is no user in my NopAccess." });
      }

      const list = data.map((x, i) => `\`${i + 1}.\` <@${x.userId}>`).join("\n");

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
              name: "NopAccess List",
              iconURL: message.guild?.iconURL() || client.user.displayAvatarURL(),
            })
            .setDescription(list),
        ],
      });
    }

    if (opt === "clear") {
      await db.deleteMany({});
      return message.channel.send({
        content: "Successfully cleared all NopAccess users.",
      });
    }

    return message.reply({
      content: `Invalid option. Use \`${prefix}nopaccess add/remove/list/clear\`.`,
    });
  },
};
