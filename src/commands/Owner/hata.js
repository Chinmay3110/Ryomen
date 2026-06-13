/** @format */

const {
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const NopAccess = require("../../schema/accessnop");
const OxP1 = require("../../schema/noprefix");
const OxP2 = require("../../schema/votebypassuser");
const OxP3 = require("../../schema/badge");

module.exports = {
  name: "hata",
  aliases: ["-"],
  category: "Owner",
  description: "Remove noprefix, vote bypass, or badges",
  args: false,
  usage: "<user> <nop/nov/bdg>",
  owner: false,

  execute: async (message, args, client, prefix) => {
    const ownerIds = [
      client.config?.ownerID,
      client.owner,
      "1507444616759218176",
      "1053885624706420807",
    ].filter(Boolean);

    if (!ownerIds.includes(message.author.id)) {
      const access = await NopAccess.findOne({ userId: message.author.id });

      if (!access) {
        return message.channel.send("___You are not allowed to use this cmd!___");
      }
    }

    if (!args[0] || !args[1]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `**Usage:**\n\`${prefix}hata <user> nop\`\n\`${prefix}hata <user> nov\`\n\`${prefix}hata <user> bdg\``,
            ),
        ],
      });
    }

    const targetUser =
      message.mentions.users.first() ||
      (await client.users.fetch(args[0]).catch(() => null));

    if (!targetUser) {
      return message.channel.send("Please mention a valid user or provide a valid user ID.");
    }

    const type = args[1].toLowerCase();

    if (type === "nop") {
      const npData = await OxP1.findOne({
        userId: targetUser.id,
        noprefix: true,
      });

      if (!npData) {
        return message.reply({
          content: "This user is not present in my NoPrefix system.",
        });
      }

      await OxP1.deleteOne({ userId: targetUser.id, noprefix: true });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.tick} Successfully removed ${targetUser} from NoPrefix.`),
        ],
      });
    }

    if (type === "nov") {
      const data = await OxP2.findOne({ userId: targetUser.id });

      if (!data) {
        return message.channel.send({
          content: "This user is not in the vote bypass list.",
        });
      }

      await OxP2.deleteOne({ userId: targetUser.id });

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Successfully removed ${targetUser} from the vote bypass list.`),
        ],
      });
    }

    if (type === "bdg") {
      const data = await OxP3.findOne({ userId: targetUser.id });

      if (!data || !data.badge) {
        return message.channel.send(`${targetUser} has no badge data.`);
      }

      const activeBadges = Object.keys(data.badge).filter(
        (badge) => data.badge[badge],
      );

      if (!activeBadges.length) {
        return message.channel.send(`${targetUser} has no badges to remove.`);
      }

      const badgeList = activeBadges
        .map((badge) => {
          const emoji = client.emoji[badge] || "";
          const name = badge.replace(/([a-z])([A-Z])/g, "$1 $2");
          return `> ${emoji} **${name}**`;
        })
        .join("\n");

      const options = activeBadges.map((badge) => ({
        label: badge.replace(/([a-z])([A-Z])/g, "$1 $2"),
        value: badge,
      }));

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("remove-badge")
          .setPlaceholder("Select badge to remove")
          .setMinValues(1)
          .setMaxValues(options.length)
          .addOptions(options),
      );

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `${targetUser.username}'s Badges`,
          iconURL: targetUser.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(badgeList)
        .setFooter({
          text: "Select badges from dropdown to remove.",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      const badgeMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const badgeCollector = badgeMessage.createMessageComponentCollector({
        filter: (i) => {
          if (message.author.id === i.user.id) return true;

          i.reply({
            content: `${client.emoji.cross} | That's not your session.`,
            flags: MessageFlags.Ephemeral,
          }).catch(() => null);

          return false;
        },
        time: 60000,
      });

      badgeCollector.on("collect", async (i) => {
        if (i.customId !== "remove-badge") return;

        const badgesToRemove = i.values;
        const memberData = await OxP3.findOne({ userId: targetUser.id });

        if (!memberData || !memberData.badge) {
          return i.reply({
            content: "Badge data not found.",
            flags: MessageFlags.Ephemeral,
          }).catch(() => null);
        }

        badgesToRemove.forEach((badge) => {
          memberData.badge[badge] = false;
        });

        await memberData.save();

        badgeCollector.stop();

        return i.update({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `Removed **${badgesToRemove.length}** badge(s) from ${targetUser}.`,
              ),
          ],
          components: [],
        }).catch(() => null);
      });

      badgeCollector.on("end", () => {
        badgeMessage.edit({ components: [] }).catch(() => null);
      });

      return;
    }

    return message.reply({
      content: `Invalid type. Use \`${prefix}hata <user> nop/nov/bdg\`.`,
    });
  },
};
