const { EmbedBuilder } = require("discord.js");
const NopAccess = require("../../schema/accessnop");
const OxP1 = require("../../schema/noprefix");
const OxP2 = require("../../schema/votebypassuser");
const ms = require("ms");

module.exports = {
  name: "add",
  aliases: ["+"],
  category: "Owner",
  description: "Add NoPrefix / VoteBypass with duration.",
  args: true,
  usage: "<user> <noprefix/votebypass/all> <duration>",
  owner: false,

  execute: async (message, args, client) => {
    const access = await NopAccess.findOne({
      userId: message.author.id,
    });

    if (
      message.author.id !== client.config.ownerID &&
      !access
    ) {
      return message.channel.send(
        "___You are not allowed to use this command!___"
      );
    }

    const user =
      message.mentions.users.first() ||
      (await client.users.fetch(args[0]).catch(() => null));

    const type = args[1]?.toLowerCase();
    const duration = args[2];

    if (!user) {
      return message.channel.send(
        "Please mention a user or provide a valid user ID."
      );
    }

    if (!["noprefix", "votebypass", "all"].includes(type)) {
      return message.channel.send(
        "Invalid type! Use `noprefix`, `votebypass`, or `all`."
      );
    }

    const time = ms(duration);

    if (!duration || !time) {
      return message.channel.send(
        "Please provide a valid duration like `1h`, `1d`, `30m`, `7d`."
      );
    }

    const expiresAt = Date.now() + time;
    const added = [];

    if (type === "noprefix" || type === "all") {
      await OxP1.findOneAndUpdate(
        { userId: user.id },
        {
          userId: user.id,
          noprefix: true,
          expiresAt,
        },
        { upsert: true, new: true }
      );

      added.push("NoPrefix");
    }

    if (type === "votebypass" || type === "all") {
      await OxP2.findOneAndUpdate(
        { userId: user.id },
        {
          userId: user.id,
          expiresAt,
        },
        { upsert: true, new: true }
      );

      added.push("VoteBypass");
    }

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color || "#2b2d31")
          .setDescription(
            `✅ Added **${added.join(" + ")}** to ${user} for **${duration}**.`
          ),
      ],
    });
  },
};
