/** @format */
require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: "1514262534637748334",
  prefix: "$",
  ownerID: "1507444616759218176",
  SpotifyID: "85aab1d51a174aad9eed6d7989f530e6",
  SpotifySecret: "b2ad05aa725e434c88776a1be8eab6c2",
  mongourl:
    "mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority",
  embedColor: "#2f3136",
  logs: "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
  node_source: "ytsearch",
  topgg:
    "here",
  links: {
    BG: "https://cdn.discordapp.com/attachments/1061636453437804544/1186002755924525166/20231217_232106.jpg",
    support: "https://discord.gg/urV9mkfW9t",
    invite:
      "https://discord.com/api/oauth2/authorize?client_id=1399186967966519326&permissions=824671333721&scope=bot",
    arrkiii:
      "https://cdn.discordapp.com/attachments/1513435221771423804/1514267242538340473/ac99e4217e0be00c8e2b2a51727cc222_720w.gif?ex=6a2abec4&is=6a296d44&hm=f4972ac4ff7d4eaf593552b5e29bbfdcd51e750921278a0d1b1b778c2ec14919",
    power: "Powered By Daddy Xylus 🌙",
    vanity: "https://discord.gg/Uvpzeh85Ux",
    guild: "1499441279145214112",
    topgg: "https://discord.gg/Uvpzeh85Ux",
  },
  Webhooks: {
      black: "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
    player_create:
      "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
    player_delete:
      "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
    guild_join:
      "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
      guild_leave: "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
    cmdrun:
 "https://canary.discord.com/api/webhooks/1514345345939800195/lmdFq6Eo7qx3R9aCAH-2eMjSZKF7Qz1n1YEJNSF8NtqZE5OWo293d1eEAqT3anl8P8I-",
  },

  nodes: [
    {
       url: process.env.NODE_URL || "lavalink.jirayu.net:13592",
      name: process.env.NODE_NAME || "Lavalink",
      auth: process.env.NODE_AUTH || "youshallnotpass",
      secure: parseBoolean(process.env.NODE_SECURE || "false"),
    },
  ],
};

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
      return true;
    default:
      return false;
  }
}
