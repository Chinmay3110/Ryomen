const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const Data = require("../../schema/badge");

module.exports = {
  name: "addpr",
  category: "Owner",
  aliases: ["addbadges"],
  description: "Add profile badges to a user",
  args: false,
  usage: "<user>",
  userPerms: [],
  owner: false,

  execute: async (message, args, client, prefix) => {
    if (!client.owner.includes(message.author.id)) {
      return message.reply("You Can't Use This Command!");
    }

    const user =
      message.mentions.members.first() ||
      await message.guild.members.fetch(args[0]).catch(() => null);

    if (!user) {
      return message.reply("Please mention a user or give a valid user ID.");
    }

    let person = await Data.findOne({ userId: user.id });

    if (!person) {
      person = await Data.create({ userId: user.id });
    }

    if (!person.badge) person.badge = {};

    const badgesList = [
      { label: "Owner", value: "owner", emoji: client.emoji.owner },
      { label: "Dev", value: "dev", emoji: client.emoji.dev },
      { label: "Admin", value: "admin", emoji: client.emoji.admin },
      { label: "Staff", value: "staff", emoji: client.emoji.staff },
      { label: "Partner", value: "partner", emoji: client.emoji.partner },
      { label: "Supporter", value: "supporter", emoji: client.emoji.supporter },
      { label: "Sponsor", value: "sponsor", emoji: client.emoji.sponsor },
      { label: "Ownerspecial", value: "ownerspecial", emoji: client.emoji.ownerspecial },
      { label: "Specialone", value: "specialone", emoji: client.emoji.specialone },
      { label: "Loveone", value: "loveone", emoji: client.emoji.loveone },
      { label: "Vip", value: "vip", emoji: client.emoji.vip },
      { label: "Friend", value: "friend", emoji: client.emoji.friend },
      { label: "Gfriend", value: "gfriend", emoji: client.emoji.gfriend },
      { label: "Bug", value: "bug", emoji: client.emoji.bug },
      { label: "Noprefix", value: "noprefix", emoji: client.emoji.noprefix },
      { label: "All", value: "all" },
    ];

    const embed = new EmbedBuilder()
      .setColor(client.color || "#2b2d31")
      .setTitle("__Select Badges__")
      .setDescription(`Choose badges to add for ${user}.`);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("badges")
        .setPlaceholder("Select badges")
        .setMinValues(1)
        .setMaxValues(badgesList.length)
        .addOptions(badgesList)
    );

    const msg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: async (i) => {
        if (i.user.id === message.author.id) return true;

        await i.reply({
          content: `${client.emoji.cross || "❌"} | That's not your session.`,
          ephemeral: true,
        });

        return false;
      },
      time: 60000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      let memberData = await Data.findOne({ userId: user.id });

      if (!memberData) {
        memberData = await Data.create({ userId: user.id });
      }

      if (!memberData.badge) memberData.badge = {};

      let selected = i.values;

      if (selected.includes("all")) {
        selected = badgesList
          .filter((b) => b.value !== "all")
          .map((b) => b.value);
      }

      for (const badge of selected) {
        memberData.badge[badge] = true;
      }

      memberData.markModified("badge");
      await memberData.save();

      const doneEmbed = new EmbedBuilder()
        .setColor(client.color || "#2b2d31")
        .setDescription(
          `✅ Added **${selected.length}** badge(s) to ${user}:\n\`${selected.join("`, `")}\``
        );

      await msg.edit({
        embeds: [doneEmbed],
        components: [],
      });

      collector.stop();
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        await msg.edit({
          components: [],
        }).catch(() => null);
      }
    });
  },
};
