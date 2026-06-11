const { Collection } = require("discord.js");
const MusicBot = require("./src/structures/MusicClient");
const initializeCleanup = require("./src/events/Client/PremiumChecks");
const Dokdo = require("dokdo");
const client = new MusicBot();
const util = require("./src/utils/util");

client.util = new util(client);
module.exports = client;
client.connect();

client.Jsk = new Dokdo.Client(client, {
  aliases: ["dokdo", "dok", "jsk"],
  prefix: "?",
  owners: ["1507444616759218176"],
});

process.env.SHELL = process.platform === "win32" ? "powershell" : "bash";

client.userSettings = new Collection();
client.color = "2b2d31";
client.emoji = {
  // music emojis
  music: "<:music:1514273839826210898>",
  playing: "<:Playing:1514274708965818460>",
  volumehigh: "<:volumehigh:1514274874388910313>",
  play: "<:play:1514275295815925853>",
  stop: "<:resume:1514275430553620691>",
  skip: "<:forward:1514275578340180109>",
  resume: "<:resume:1514275430553620691>",
  join: "<:join:1514275799421681705>",
  leave: "<:leave:1514275927347953694>",
  autoplay: "<:autoplay:1514276120093261945>",
  mute: "<:mute:1514276231997292574>",
  volumemiddle: "<:volumemiddle:1514274962247258153>",
  volumelow: "<:volumelow:1514274921939861626>",
  shuffle: "<:shuffle:1514276763251773592>",
  rewind: "<:rewind:1514276917690368152>",
  queue: "<:queue:1514277325129257102>",
  playlist: "<:playlist:1514277438010560674>",
  pause: "<:pause:1514277469606248548>",
  loop: "<:loop:1514277493270515805>",
  forward: "<:forward:1514275578340180109> ",
  filter: "<:filter:1514278074852704396>",
  addsong: "<:autoplay:1514276120093261945>",
  replay: "<:loop:1514277493270515805>",

  // utils emojis
  extra: "<:extra:1514278438989463602>",
  role: "<:roles:1514278502952861887>",
  delete: "<:del:1514278621215326268>",
  left: "<:left:1514278658876117042>",
  right: "<:right:1514278682104172687>",
  tick: "<:yes:1514279214407483606>",
  cross: "<:no:1514279310666502184>",
  dot: "<:dot:1514279378287202475>",
  warn: "<:warn:1514279958262841515>",
  search: "<:search:1514280122667110462>",
  jump: "<:join:1514275799421681705>",
  loading: "<a:loading:1514280407586312363>",
  config: "<:config:1514274249219637248>",
  information: "<:info:1514280504046780496>",
  home: "<:home:1514280564243562659>",
  ignore: "<:ignore:1514280622804172841>",
  profile: "<:profile:1514281017551097957>",
  premium: "<:premium:1514281047989293156>",
  dnd: "<:dnd:1514281108085276673>",
  offline: "<:offline:1514281176435523626>",
  online: "<:online:1514281216759824407>",
  idle: "<:idle:1514281248028102708>",
  voice: "<:voice:1514281335571873995>",
  fun: "<:fun:1514282031725547690>",
  moderation: "<:Mods:1514287916858212713>",
  pfp: "<:pfp:1514282272386453538>",
  autoresponder: "<:Mods:1514287916858212713>",
  insta: "<:Insta:1514282473284960428>",
  snap: "<:Snap:1514282504755085514>",
  discord: "<a:Xieron_stolen_emoji_1781103797:1514283824899555489>",
  welc: "<:Xieron_stolen_emoji_1781103754:1514283642422169851>",
  utility: "<:Xieron_stolen_emoji_1781103873:1514284142987313246>",
  antinuke: "<:anti:1514272677500817650>",

  // pr emojis
  ozuma: "<:Ozuma:1169971284332003440>",
  owner: "<:Owners:1199282508269879346>",
  dev: "<:OxP:1199284739899670548>",
  admin: "<:Arrkiii:1199284047113883670>",
  staff: "<:Staffs:1199284056853069885>",
  partner: "<:Partners:1199282537357381762>",
  supporter: "<:supporter:1222100920175951882>",
  sponsor: "<:sponsor:1222100909769883698>",
  os: "<:ownerspecial:1222100912043069492>",
  vip: "<:Vips:1199282523331625020>",
  friend: "<:Homies:1199282532852699198>",
  bug: "<:Mods:1199282520114593884>",
  ownerspecial: "<:ownerspecial:1222100912043069492>",
  specialone: "<:special:1199284052046389329>",
  loveone: "<:love:1222100917206388766>",
  arrkiii: "<:Xieron_stolen_emoji_1781103940:>",
  // a to z
  a: "<:A_simper:1211571868956622878>",
  b: "<:B_simper:1211571967015129118>",
  c: "<:C_simper:1211571972014874644>",
  d: "<:D_simper:1211571975726698497>",
  e: "<:E_simper:1211571981959561227>",
  f: "<:F_simper:1211571986820767784>",
  g: "<:G_simper:1211571992847978537>",
  h: "<:H_simper:1211571998443053106>",
  i: "<:I_simper:1211572004642361414>",
  j: "<:J_simper:1211572010308730951>",
  k: "<:K_simper:1211572015912194089>",
  l: "<:L_simper:1211572021385887775>",
  m: "<:M_simper:1211572027190677524>",
  n: "<:N_simper:1211572030533664828>",
  o: "<:O_simper:1211572035751510066>",
  p: "<:P_simper:1211572041820405802>",
  q: "<:Q_simper:1211572047155568650>",
  r: "<:R_simper:1211572054520889364>",
  s: "<:S_simper:1211572059793006613>",
  t: "<:T_simper:1211572065614700585>",
  u: "<:U_simper:1211572071130468353>",
  v: "<:V_simper:1211572076486459473>",
  w: "<:W_simper:1211572081737605182>",
  x: "<:X_simper:1211572085651148801>",
  y: "<:Y_simper:1211572090310889504>",
  z: "<:Z_simper:1211572095696502794>",
};

const { Api } = require("@top-gg/sdk");
client.topgg = new Api(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMzM0OTY3MDg5OTIyMDQ4NDAiLCJib3QiOnRydWUsImlhdCI6MTczNTgxNjQ3OH0.J6DEdwViWOgYqHJ1Y9NoFgmVRbfSRoLFLfl0TG-j7es",
);

client.on("messageCreate", (message) => {
  client.Jsk.run(message);
});

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});

//
