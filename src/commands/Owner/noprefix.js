/** @format
 *
 * Ryomen By Chinmay
 * © 2026 Ryomen Development
 *
 */

const {
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const db = require("../../schema/noprefix");

module.exports = {
  name: "noprefix",
  aliases: ["nop"],
  category: "Owner",
  description: "Manage NoPrefix status and tiers for users.",
  args: true,
  usage: "<user | list>",

  execute: async (message, args, client) => {
    if (message.author.id !== client.config.ownerID) {
      return message.channel.send(
        "___You are not allowed to use this command!___",
      );
    }

    if (!args[0]) {
      return message.reply("Please mention a user, provide a user ID, or use `list`.");
    }

    if (args[0].toLowerCase() === "list") {
      const data = await db.find({ noprefix: true });

      if (!data.length) {
        return message.reply("There is no user in my NoPrefix system.");
      }

      const now = Date.now();
      const validUsers = data.filter((x) => !x.expiresAt || x.expiresAt > now);

      if (!validUsers.length) {
        return message.reply("All NoPrefix users have expired.");
      }

      const users = await Promise.all(
        validUsers.map(async (x) => {
          try {
            return await client.users.fetch(x.userId);
          } catch {
            return null;
          }
        }),
      ).then((list) => list.filter((user) => user !== null));

      const pages = [];

      for (let i = 0; i < users.length; i += 10) {
        const page = users
          .slice(i, i + 10)
          .map((user, index) => {
            const entry = validUsers.find((x) => x.userId === user.id);
            const timeLeft = entry.expiresAt
              ? `<t:${Math.floor(new Date(entry.expiresAt).getTime() / 1000)}:R>`
              : "Permanent";

            return `> \`${i + index + 1}.\` [__${user.displayName}__](https://discord.com/users/${user.id}) - **Time Left:** ${timeLeft}`;
          })
          .join("\n");

        pages.push(page);
      }

      let page = 0;

      const createEmbed = () =>
        new EmbedBuilder()
          .setTitle(`${client.user.username} NoPrefix List`)
          .setColor(client.embedColor || client.color || "#00FF7F")
          .setImage(client.config.links.arrkiii)
          .setDescription(pages[page])
          .setFooter({
            text: `Page ${page + 1}/${pages.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });

      if (users.length <= 10) {
        return message.channel.send({ embeds: [createEmbed()] });
      }

      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("nop_list_previous")
          .setEmoji(client.emoji.left)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("nop_list_stop")
          .setEmoji(client.emoji.delete)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("nop_list_next")
          .setEmoji(client.emoji.right)
          .setStyle(ButtonStyle.Secondary),
      ]);

      const msg = await message.channel.send({
        embeds: [createEmbed()],
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        filter: (b) => {
          if (b.user.id === message.author.id) return true;

          b.reply({
            flags: MessageFlags.Ephemeral,
            content: `Only **${message.author.tag}** can use this button.`,
          });

          return false;
        },
        time: 60000 * 5,
        idle: 60000 * 2,
      });

      collector.on("collect", async (button) => {
        await button.deferUpdate().catch(() => {});

        if (button.customId === "nop_list_next") {
          page = (page + 1) % pages.length;
        } else if (button.customId === "nop_list_previous") {
          page = (page - 1 + pages.length) % pages.length;
        } else if (button.customId === "nop_list_stop") {
          return collector.stop();
        }

        await msg.edit({ embeds: [createEmbed()], components: [row] });
      });

      collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
      return;
    }

    const user = await (async () => {
      if (message.mentions.users.first()) return message.mentions.users.first();

      try {
        return await client.users.fetch(args[0]);
      } catch {
        return null;
      }
    })();

    if (!user) {
      return message.reply("Please mention a user or provide a valid user ID.");
    }

    const noprefixData = await db.findOne({ userId: user.id });

    const timeLeft = noprefixData?.expiresAt
      ? `<t:${Math.floor(new Date(noprefixData.expiresAt).getTime() / 1000)}:R>`
      : noprefixData
        ? "Permanent"
        : "No NoPrefix assigned";

    const userEmbed = new EmbedBuilder()
      .setTitle(`${user.username}'s NoPrefix Management`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor("#00FF7F")
      .addFields({ name: "Current Status", value: timeLeft });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(noprefixData ? "remove-noprefix" : "add-noprefix")
        .setLabel(noprefixData ? "Remove NoPrefix" : "Add NoPrefix")
        .setStyle(noprefixData ? ButtonStyle.Danger : ButtonStyle.Success),
    );

    const msg = await message.channel.send({
      embeds: [userEmbed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "You cannot use this button.",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (interaction.customId === "remove-noprefix") {
        await db.deleteOne({ userId: user.id });

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(`✅ Removed **NoPrefix** from ${user}.`),
          ],
          components: [],
        });
      }

      if (interaction.customId === "add-noprefix") {
        const tierRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bronze")
            .setLabel("Bronze (1 Day)")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("silver")
            .setLabel("Silver (1 Week)")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("gold")
            .setLabel("Gold (1 Month)")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("diamond")
            .setLabel("Diamond (Permanent)")
            .setStyle(ButtonStyle.Danger),
        );

        await interaction.update({
          content: "Select a tier to assign NoPrefix:",
          embeds: [userEmbed],
          components: [tierRow],
        });

        const tierCollector = msg.createMessageComponentCollector({
          time: 30000,
        });

        tierCollector.on("collect", async (tierInteraction) => {
          if (tierInteraction.user.id !== message.author.id) {
            return tierInteraction.reply({
              content: "You cannot use this button.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const durations = {
            bronze: 86400000,
            silver: 604800000,
            gold: 2592000000,
          };

          const expiresAt =
            tierInteraction.customId === "diamond"
              ? null
              : Date.now() + durations[tierInteraction.customId];

          await db.updateOne(
            { userId: user.id },
            {
              userId: user.id,
              guildId: message.guild.id,
              noprefix: true,
              expiresAt,
            },
            { upsert: true },
          );

          await tierInteraction.update({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("#00FF7F")
                .setDescription(
                  `✅ Assigned **${tierInteraction.customId.toUpperCase()}** NoPrefix to ${user}.`,
                ),
            ],
            components: [],
          });

          tierCollector.stop();
          collector.stop();
        });

        tierCollector.on("end", () => {
          msg.edit({ components: [] }).catch(() => {});
        });
      }
    });

    collector.on("end", () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
