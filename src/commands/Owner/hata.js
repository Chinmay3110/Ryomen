/** @format
 *
 * Ryomen By Chinmay
 * © 2026 Ryomen Development
 *
 */

const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const OxP1 = require("../../schema/noprefix");
const OxP2 = require("../../schema/votebypassuser");
const OxP3 = require("../../schema/badge");

module.exports = {
  name: `hata`,
  aliases: ["-"],
  category: "Owner",
  description: "No prefix toggling",
  args: false,
  usage: "",
  owner: false,

  execute: async (message, args, client, prefix) => {
    if (message.author.id !== client.config.ownerID) {
      return message.channel.send("___You are not allowed to use this cmd!___");
    }

    const targetUser =
      client.users.cache.get(args[0]) || message.mentions.users.first();

    if (!targetUser) {
      return message.channel.send("Can you please mention a user to add?");
    }

    if (!args[1]) {
      const oxp = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `\`\`\`[] = Optional Argument\n<> = Required Argument\nDo NOT type these when using commands!\`\`\`\n\n**Usage:**\n\`\`${prefix}hata @user nop\`\`\n\`\`${prefix}hata @user nov\`\`\n\`\`${prefix}hata @user bdg\`\``
        );
      return message.channel.send({ embeds: [oxp] });
    }

    if (args[1] === "nop") {
      const npData = await OxP1.findOne({
        userId: targetUser.id,
        noprefix: true,
      });

      if (!npData) {
        return message.reply({
          content: `<:arrkiii:1187678838759628800> | This user is not present in my no prefix system.`,
        });
      }

      await OxP1.deleteOne({ userId: targetUser.id, noprefix: true });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.tick} | Successfully **Removed** ${targetUser} from my no prefix.`
            ),
        ],
      });
    }

    if (args[1] === "nov") {
      const data = await OxP2.findOne({ userId: targetUser.id });

      if (!data) {
        return message.channel.send({
          content: `This user is not in the vote bypass list.`,
        });
      }

      await data.deleteOne();

      const embed = new EmbedBuilder().setDescription(
        `Successfully removed ${targetUser} from the vote bypass list.`
      );

      return message.channel.send({ embeds: [embed] });
    }

    if (args[1] === "bdg") {
      const cache = [];
      const selectedUser = targetUser;
      const data = await OxP3.findOne({ userId: selectedUser.id });

      if (!data || !data.badge) {
        return message.channel.send(`Oops! **${selectedUser.username}** has no badges.`);
      }

      for (const [badge, value] of Object.entries(data.badge)) {
        if (value) {
          cache.push(
            `> ${client.emoji[badge] || ""} **${badge.replace(
              /([a-z])([A-Z])/g,
              "$1 $2"
            )}**`
          );
        }
      }

      if (cache.length === 0) {
        return message.channel.send(`Oops! **${selectedUser.username}** has no badges.`);
      }

      const removing = Object.keys(data.badge)
        .filter((badge) => data.badge[badge])
        .map((badge) => ({
          label: badge.replace(/([a-z])([A-Z])/g, "$1 $2"),
          value: badge,
        }));

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("remove-badge")
          .setPlaceholder("Select a badge to remove")
          .setMinValues(1)
          .setMaxValues(removing.length)
          .addOptions(removing)
      );

      const embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({
          name: `${selectedUser.username}'s Profile`,
          iconURL: selectedUser.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `[${selectedUser.displayName}'s](${client.config.links.support}) Badges\n${cache.join("\n")}`
        )
        .setFooter({
          text: `Remove badges by selecting from the dropdown!`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setImage(client.config.links.arrkiii);

      const badgeMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const badgeCollector = badgeMessage.createMessageComponentCollector({
        filter: (i) => {
          if (message.author.id === i.user.id) return true;

          i.reply({
            content: `${client.emoji.cross} | That's not your session.`,
            ephemeral: true,
          });
          return false;
        },
        time: 60000,
      });

      badgeCollector.on("collect", async (i) => {
        if (i.customId === "remove-badge") {
          const badgesToRemove = i.values;
          const memberData = await OxP3.findOne({ userId: selectedUser.id });

          if (memberData) {
            badgesToRemove.forEach((badge) => {
              memberData.badge[badge] = false;
            });

            await memberData.save();

            await i.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `Removed **${badgesToRemove.length}** badges from <@${selectedUser.id}>`
                  ),
              ],
            });
          }
        }
      });
    }
  },
};
