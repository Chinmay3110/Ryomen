const { promisify } = require("util");
const Wait = promisify(setTimeout);
const { ChannelType } = require("discord.js");

const destroying = new Set();

async function safeDestroy(player, guildId) {
  if (!player) return false;
  if (destroying.has(guildId)) return false;
  if (player.destroyed) return false;

  destroying.add(guildId);

  try {
    await player.destroy();
    return true;
  } catch (err) {
    const msg = String(err?.message || err);
    if (!msg.includes("already destroyed")) {
      console.error("Player destroy error:", err);
    }
    return false;
  } finally {
    setTimeout(() => destroying.delete(guildId), 5000);
  }
}

module.exports = {
  name: "voiceStateUpdate",

  run: async (client, oldState, newState) => {
    const guildId = newState.guild.id;
    const botId = client.user.id;

    const player = client.manager.players?.get(guildId);
    if (!player) return;

    const guild = client.guilds.cache.get(guildId);

    // BOT DISCONNECTED FROM VC
    if (oldState.id === botId && oldState.channelId && !newState.channelId) {
      try {
        const voiceId = player.voiceId;
        const textId = player.textId;

        await client.rest
          .put(`/channels/${voiceId}/voice-status`, {
            body: { status: "" },
          })
          .catch(() => null);

        await Wait(3000);

        const destroyed = await safeDestroy(player, guildId);

        if (destroyed) {
          const textChannel = client.channels.cache.get(textId);
          if (textChannel) {
            textChannel
              .send({
                embeds: [
                  new client.embed().setAuthor({
                    name: "The bot has been disconnected from the Voice Channel",
                    icon: guild?.iconURL(),
                  }),
                ],
              })
              .then((msg) =>
                setTimeout(() => msg.delete().catch(() => null), 5000),
              )
              .catch(() => null);
          }
        }
      } catch (error) {
        console.error("Error handling voiceStateUpdate disconnect:", error);
      }

      return;
    }

    // BOT MOVED TO ANOTHER VC
    if (
      oldState.id === botId &&
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      try {
        if (!player.destroyed) {
          player.setVoiceChannel(newState.channelId);
        }

        const textChannel = client.channels.cache.get(player.textId);
        if (textChannel) {
          textChannel
            .send({
              embeds: [
                new client.embed().setAuthor({
                  name: "The bot was moved to another Voice Channel",
                  icon: guild?.iconURL(),
                }),
              ],
            })
            .then((msg) =>
              setTimeout(() => msg.delete().catch(() => null), 5000),
            )
            .catch(() => null);
        }
      } catch (err) {
        console.error("Error handling bot moved VC:", err);
      }

      return;
    }

    // BOT LEFT ALONE IN VC
    const currentChannel = newState.channel || oldState.channel;

    if (
      currentChannel &&
      currentChannel.type === ChannelType.GuildVoice &&
      currentChannel.members.has(botId) &&
      currentChannel.members.filter((m) => !m.user.bot).size === 0
    ) {
      setTimeout(async () => {
        const activePlayer = client.manager.players?.get(guildId);
        if (!activePlayer || activePlayer.destroyed) return;

        const freshGuild = client.guilds.cache.get(guildId);
        const freshBotMember = freshGuild?.members.cache.get(botId);
        const freshChannel = freshBotMember?.voice.channel;

        if (!freshChannel) return;

        const stillAlone =
          freshChannel.members.filter((m) => !m.user.bot).size === 0;

        if (!stillAlone) return;

        const textId = activePlayer.textId;
        const destroyed = await safeDestroy(activePlayer, guildId);

        if (destroyed) {
          const textChannel = client.channels.cache.get(textId);
          if (textChannel) {
            textChannel
              .send({
                embeds: [
                  new client.embed().setAuthor({
                    name: "Left the Voice Channel due to inactivity",
                    icon: freshGuild?.iconURL(),
                  }),
                ],
              })
              .then((msg) =>
                setTimeout(() => msg.delete().catch(() => null), 5000),
              )
              .catch(() => null);
          }
        }
      }, 1000 * 60);
    }
  },
};
