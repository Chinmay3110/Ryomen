/** @format */
require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: "1514262534637748334",
  prefix: "$",
  ownerID: "870179991462236170",
  SpotifyID: "85aab1d51a174aad9eed6d7989f530e6",
  SpotifySecret: "b2ad05aa725e434c88776a1be8eab6c2",
  mongourl:
    "mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority",
  embedColor: "#2f3136",
  logs: "https://discord.com/api/webhooks/1399187361694482462/--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
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
      black: "https://discord.com/api/webhooks/1399187361694482462/MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
    player_create:
      "https://discord.com/api/webhooks/1399187361694482462/MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
    player_delete:
      "https://discord.com/api/webhooks/1399187361694482462/MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
    guild_join:
      "https://discord.com/api/webhooks/1399187361694482462/MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
      guild_leave: "https://discord.com/api/webhooks//MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
    cmdrun:
 "https://discord.com/api/webhooks/1399187361694482462/MtGa--yD8NpadUuQJ2_XG8tfWRraU1MnDyRhtnpqr825pDo",
  },

  nodes: [
    {
       url: process.env.NODE_URL || "lava-v4.ajieblogs.eu.org:80",
      name: process.env.NODE_NAME || "Lavalink",
      auth: process.env.NODE_AUTH || "https://dsc.gg/ajidevserver",
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
